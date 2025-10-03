import { Router } from "express";
import prisma from "../prisma";
import { genSalt, hash } from "bcrypt";
const router = Router();

router.post('/', async (req, res) => {
    const { userid, token, newPassword } = req.body;

    if (!userid || !token || !newPassword || typeof userid !== "string" || typeof token !== "string" || typeof newPassword !== "string") {
        return res.status(404).json({ success: false, message: "Invalid Body" })
    }

    const fifteenMinsAgo = new Date(Date.now() - 15 * 60 * 1000);

    try {
        const tokenInfo = await prisma.forgotPassword.findFirst({
            where: {
                userId: userid,
                resetToken: token,
                createdAt: { gte: fifteenMinsAgo, lte: new Date() }
            }
        })

        console.log(tokenInfo)
        if (!tokenInfo) {
            return res.status(401).json({ success: false, message: "Invalid/Timedout token." })
        }

        const salt = await genSalt(10);
        const hashedPass = await hash(newPassword, salt);

        await prisma.user.update({
            where: {
                id: userid,
            },
            data: {
                password: hashedPass
            }
        });

        await prisma.forgotPassword.delete({
            where: { resetToken: token }
        });


        return res.status(202).json({ success: true, data: newPassword })
    } catch (e) {
        console.error(e);
        return res.status(500).json({ success: false, message: "Internal Server Error. Please try again later" })
    }
})

export default router;