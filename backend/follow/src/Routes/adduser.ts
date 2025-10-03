import { Router } from "express";
import neo from "../dbdriver";
import isEmail from '../helpers/isEmail'
const router = Router();

router.post("/", async (req, res) => {
    const { userid, email, username } = req.body;
    if (!userid || !email || !username || typeof email !== "string" || typeof userid !== "string" || typeof username !== "string") {
        console.error("Invalid input");
        return res.status(404).json({ success: false, message: "Invalid Input" })
    }

    if (!isEmail(email)) {
        return res.status(404).json({ success: false, message: "Invalid email" })
    }

    try {
        let { records, summary } = await neo.executeQuery(`
            OPTIONAL MATCH (b:User { id: $id })
            WHERE b IS NULL
            CREATE (a:User {id: $id, email : $email, username: $username})
            RETURN a`
            ,
            {
                id: userid,
                email: email.toLowerCase(),
                username: username.toLowerCase()
            }
        );

        if (records.length === 0) {
            return res.status(404).json({ success: false, message: "User already exists." })
        }

        console.log(
            `Created ${summary.counters.updates().nodesCreated} nodes ` +
            `in ${summary.resultAvailableAfter} ms.`
        )

        return res.status(201).json({ success: true, data: { records, summary } });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error." })
    }

})

export default router;