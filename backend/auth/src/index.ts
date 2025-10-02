import express from 'express';
import { config } from 'dotenv' /// todo remove in prod

config() /// todo remove in prod

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import signup from './Routes/signup'
import login from './Routes/login'

app.use('/signup', signup);
app.use('/login', login);

// endpoint to test if server is running
app.get('/test', async (_req, res) => {
    return res.status(200).json({success:true, message:"success",});
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
