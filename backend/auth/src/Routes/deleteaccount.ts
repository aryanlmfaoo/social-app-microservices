import { Router } from "express";
import prisma from "../prisma";
import { compare } from "bcrypt";

const router = Router();

router.delete("/", async (req, res) => {
    const { id, password } = req.body;
    if (!id || !password || typeof id !== "string" || typeof password !== "string") {
        return res.status(404).json({ success: false, message: "" })
    }
    try {
        const userData = await prisma.user.findFirst({
            where: {
                id: id
            }
        })
        if (!userData) {
            return res.status(404).json({ success: false, message: "User does not exist." })
        }

        const correctPass = compare(password, userData.password)
        if (!correctPass) {
            return res.status(404).json({ success: false, message: "Wrong password." })
        }

        await Promise.all([
            prisma.user.delete({
                where: {
                    id: id
                }
            }),
            prisma.forgotPassword.deleteMany({
                where: {
                    userId: id
                }
            })])

        return res.status(200).json({ success: true })
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Internal server error." })
    }

})

export default router;