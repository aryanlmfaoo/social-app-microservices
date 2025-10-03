import { Router } from 'express';
import prisma from "../prisma";
import { genSalt, hash } from 'bcrypt'
import isEmail from "../helpers/isEmail";

const router = Router();


/// TODO send jwt after signup
router.post('/', async (req, res) => {
    const { name, username, email, password } = req.body; // get data from req body

    // check data isn't missing
    if (!name || !username || !email || !password) {
        return res.status(404).json({ success: false, message: 'Invalid email or password' });
    }

    // regex check for email
    if (!isEmail(email.toLowerCase())) {
        return res.status(404).json({ success: false, message: 'Invalid email' });
    }

    // check if email or user already exists
    const usernameOrEmailExists = await prisma.user.count(
        {
            where:
            {
                OR: [
                    { email: email },
                    { username: username }
                ]
            }
        });

    // if true, return
    if (usernameOrEmailExists > 0) {
        return res.status(404).json({ success: false, message: 'Username or email already exists. Log in instead.' });
    }

    // hash the password
    const salt = await genSalt(10);
    const hashedPass = await hash(password, salt);

    // save user in DB
    try {
        const result = await prisma.user.create({
            data: {
                username: username.toLowerCase(),
                name: name,
                email: email.toLowerCase(),
                password: hashedPass,
            }
        });

        return res.status(200).json({ success: true, message: 'Successfully registered.', data: result });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message: 'Something went wrong. Please try again later.' });
    }
})


export default router;
