/// i use gpt for my console logs cause im too lazy to write them, but the code is purely human written by me bro ngl ts pmo fr ong ngl 

import express from 'express';
import { config } from 'dotenv'; /// TODO remove in prod
import connectToNeo from './dbconnect';
config() /// TODO remove in prod

const app = express();

import adduser from './Routes/adduser';
import removeuser from './Routes/removeuser';
import follow from './Routes/follow';
import unfollow from './Routes/unfollow';

connectToNeo() // connecting to db

app.use(express.json());
app.use(express.urlencoded());

app.use('/adduser', adduser);
app.use("/removeuser", removeuser)
app.use("/follow", follow)
app.use("/unfollow", unfollow)

app.listen(5001, () => {
    console.log("Listening on port 5001");
})