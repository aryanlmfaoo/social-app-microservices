import { Router } from 'express';
import { compare } from 'bcrypt'
import jwt from 'jsonwebtoken';
import isEmail from "../helpers/isEmail";
import prisma from "../prisma";

const router = Router();
const secretKey = process.env.JWT_SECRET

if (!secretKey) {
    console.log("Secret key is missing");
    process.exit(1);
}

router.post('/', async (req, res) => {
    const { emailOrUsername, password } = req.body; // yk what this does bro

    // just checking yk
    if (!emailOrUsername || !password) {
        return res.status(404).json({ success: false, message: 'Invalid input.' });
    }

    // get data from DB
    try {
        let dbData;
        if (isEmail(emailOrUsername)) {
            dbData = await prisma.user.findFirst({ where: { email: emailOrUsername } });
        } else {
            dbData = await prisma.user.findFirst({ where: { username: emailOrUsername } });
        }

        // if db doesn't return anything
        if (!dbData) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        // check password
        const passMatch = await compare(password, dbData.password);

        // if pass is correct, return token
        if (passMatch) {
            const token = jwt.sign({ id: dbData.id, name: dbData.name }, secretKey, { expiresIn: '3h' });
            return res.status(200).json({ success: true, token });
        } else {
            return res.status(401).json({ success: false, message: 'Authentication failed.' });
        }
    } catch (e) {
        console.error(e);
        return res.status(500).json({ success: false, message: e });
    }
})

export default router