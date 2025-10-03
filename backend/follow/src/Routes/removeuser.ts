import { Router } from "express";
import neo from "../dbdriver";

const router = Router();

router.delete("/", async (req, res) => {
    console.log("[DELETE /] Incoming request body:", req.body);

    const { userid } = req.body;

    if (!userid || typeof userid !== "string") {
        console.log("[DELETE /] Invalid input:", userid);
        return res.status(404).json({ success: false, message: "Invalid Input" });
    }

    console.log("[DELETE /] Deleting user with id:", userid.toLowerCase());
    try {
        const { records, summary } = await neo.executeQuery(`
        OPTIONAL MATCH (n:User {id : $id})
        WHERE n IS NOT NULL
        DETACH DELETE n`, {
            id: userid.toLowerCase()
        });

        if (records.length === 0) {
            console.log("[DELETE /] Query executed. User does not exist.");
            return res.status(404).json({ success: false, message: "User does not exist." })
        }

        console.log("[DELETE /] Query executed. Summary:", summary);

        console.log(
            `[DELETE /] Removed ${summary.counters.updates().nodesDeleted} nodes ` +
            `in ${summary.resultAvailableAfter} ms.`
        );

        return res.status(202).json({ success: true, data: { records, summary } });

    } catch (error) {
        console.log("[DELETE /] Error occured. message:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error. Please try again later." })
    }
});

export default router;
