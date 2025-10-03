import { Router } from "express";
import neo from "../dbdriver";

const router = Router();

router.delete("/", async (req, res) => {
    console.log("Received DELETE request to unfollow user");
    const { thisUserId, isUnfollowingThisUserId } = req.body;
    console.log(`thisUserId: ${thisUserId}, isUnfollowingThisUserId: ${isUnfollowingThisUserId}`);

    if (!thisUserId || !isUnfollowingThisUserId || typeof thisUserId !== "string" || typeof isUnfollowingThisUserId !== "string") {
        console.error("Invalid input received");
        return res.status(404).json({ success: false, message: "invalid input" });
    }

    try {
        console.log("Executing Neo4j query to delete follow relationship");
        const { records, summary } = await neo.executeQuery(`
    MATCH (a:User {id: $id})-[r:FOLLOWS]->(b:User {id: $otherId})
    DELETE r
    RETURN a, b
    `, {
            id: thisUserId,
            otherId: isUnfollowingThisUserId
        });

        if (records.length == 0) {
            console.log("No follow relationship found");
            return res.status(404).json({ success: false, message: "No follow relationship found between these users" });
        }

        console.log("Query executed successfully");
        console.log("Records:", records);
        console.log("Summary:", summary);
        return res.status(202).json({ success: true, records, summary });
    } catch (e) {
        console.error("Error executing Neo4j query:", e);
        return res.status(500).json({ success: false, message: "Internal Server Error." });
    }
});

export default router;