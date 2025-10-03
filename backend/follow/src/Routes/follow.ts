import { Router } from "express";
import neo from "../dbdriver";

const router = Router();

router.post("/", async (req, res) => {
    const { thisUserId, isFollowingThisUserId } = req.body;
    console.log(`Received follow request: thisUserId=${thisUserId}, isFollowingThisUserId=${isFollowingThisUserId}`);

    if (!thisUserId || !isFollowingThisUserId || typeof thisUserId !== "string" || typeof isFollowingThisUserId !== "string") {
        console.log(`Invalid input: thisUserId=${thisUserId}, isFollowingThisUserId=${isFollowingThisUserId}`);
        return res.status(404).json({ success: false, message: "Invalid Input" });
    }

    try {
        console.log(`Executing Neo4j query to create FOLLOWS relationship between ${thisUserId} and ${isFollowingThisUserId}`);
        const { records, summary } = await neo.executeQuery(`
        MATCH (a:User {id: $thisUserId})
        MATCH (b:User {id: $isFollowingThisUserId}) 
        OPTIONAL MATCH (a)-[r:FOLLOWS]->(b)     
        WITH a, b, r                            
        WHERE r IS NULL                         
        CREATE (a)-[:FOLLOWS]->(b)              
        RETURN a, b
        `, {
            thisUserId,
            isFollowingThisUserId
        });

        if (records.length === 0) {
            console.log(`Follow request failed: users not found or already following (thisUserId=${thisUserId}, isFollowingThisUserId=${isFollowingThisUserId})`);
            return res.status(404).json({ success: false, message: "Cannot follow: either user does not exist or already following" });
        }

        console.log(
            `Created ${summary.counters.updates().relationshipsCreated} relationships ` +
            `in ${summary.resultAvailableAfter} ms.`
        );

        console.log(`Follow request successful for thisUserId=${thisUserId} following isFollowingThisUserId=${isFollowingThisUserId}`);
        return res.status(201).json({ success: true, data: { records, summary } });
    } catch (error) {
        if (error instanceof Error) {
            console.error(`Error creating FOLLOWS relationship: ${error.message}`);
            return res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    }
})

export default router;