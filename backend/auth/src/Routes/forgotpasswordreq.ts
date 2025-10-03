import { Router } from "express";
import isEmail from "../helpers/isEmail";
import prisma from "../prisma";
import client from '@sendgrid/client';
import sgMail from '@sendgrid/mail';

const router = Router();

router.post('/', async (req, res) => {
    const { emailOrUsername } = req.body;
    if (!emailOrUsername) {
        return res.status(401).send('Invalid email or username');
    }

    let user;
    if (isEmail(emailOrUsername)) {
        user = await prisma.user.findUnique({ where: { email: emailOrUsername } });
    } else {
        user = await prisma.user.findUnique({ where: { username: emailOrUsername } });
    }

    if (!user) {
        return res.status(401).send('Invalid email or username');
    }


    const resetPasswordUUID = crypto.randomUUID();

    try {
       await prisma.forgotPassword.create({
            data: {
                userId: user.id,
                resetToken: resetPasswordUUID,
            }
        });

        client.setDataResidency('global');
        const msg = {
            to: user.email,
            from: 'aryansharm1223@gmail.com', // company email yk what i mean
            subject: 'Reset your password',
            text: 'Hello plain world!',
            html: `<h1>Reset your password </h1> <a href="https://google.com">${resetPasswordUUID} ${user.id}</a>`, /// TODO change this and fix it
        };
        sgMail.setClient(client);
        sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");
        sgMail
            .send(msg)
            .then(() => {
                console.log('Email sent')
            })
            .catch((error) => {
                console.error(error)
            })
        // send email mechanism

        return res.status(200).json({ success: true });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }

})

export default router;