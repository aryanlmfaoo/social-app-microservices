import express from 'express';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get('/', (_req, res) => {
    res.status(200).json({success:true});
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
