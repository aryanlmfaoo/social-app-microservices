import { Router } from 'express';
import neo from '../dbdriver';

const router = Router();

router.get("/", async (req, res) => {
    const { id } = req.query;
    if (!id || typeof id !== "string") {
        return res.status(404).json({ success: false, message: "Invalid input." })
    }

    const { records } = await neo.executeQuery(`
    OPTIONAL MATCH (a:User {id: $id})
    WITH a
    OPTIONAL MATCH (a)-[:FOLLOWS]->(b:User)
    WITH a, collect({ id: b.id, username: b.username, email: b.email }) AS rawFollowers
    RETURN a IS NOT NULL AS userExists, [f IN rawFollowers WHERE f.id IS NOT NULL] AS followers
    `, { id });

    // if user doesn't exist 
    if (!records[0].get("userExists")) {
        return res.status(404).json({ success: false, message: "User does not exist." })
    }

    const followerArray = records[0].get("followers");

    if (followerArray.length === 0) {
        return res.status(200).json({ success: true, data: [] });
    }

    console.log("No of followers:" + followerArray.length);

    return res.status(200).json({ success: true, data: followerArray })
});

export default router;