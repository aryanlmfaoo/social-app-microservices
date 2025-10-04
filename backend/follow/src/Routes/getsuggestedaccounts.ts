import { Router } from 'express';
import neo from '../dbdriver';

const router = Router();

router.get("/", async (req, res) => {
    const { id, page, limit } = req.query;

    if (!id || !page || !limit || typeof id !== "string" || typeof page !== "string" || typeof limit !== "string") {
        return res.status(404).json({ success: false, message: "Invalid Input." })
    }
    const limitVal = Number(limit)
    const skip = Number(page) * limitVal;

    if (isNaN(Number(page))) {
        return res.status(404).json({ success: false, message: "Invalid Page value. Enter a Number" })
    }

    try {
        const { records } = await neo.executeQuery(`
                MATCH (a:User {id: $id })-[:FOLLOWS]->(b) 
                WHERE (b)-[:FOLLOWS]->(a)
                MATCH (b)-[:FOLLOWS]->(c)
                WHERE NOT (a)-[:FOLLOWS]->(c) AND c <> a
                RETURN c.id as userID, c.username as username, c.email as email, count(b) AS freq 
                ORDER BY freq DESC
                SKIP ${skip} 
                LIMIT ${limitVal}
                `,
            { id }  // using ${skip} cause $skip parses skip into a float instead of a decimal, this is a temporary workaround. Same for limit.
        );

        let suggestionArray = [];
        for (const src of records) {
            suggestionArray.push({
                id: src.get("userID"),
                username: src.get("username"),
                email: src.get("email")
            });
        }

        return res.status(200).json({ success: true, data: suggestionArray })

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error." })
    }
});

export default router;