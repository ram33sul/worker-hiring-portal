import express from 'express';
import dotenv from 'dotenv';
import database from './config/database';
import apiRouter from './routes';

dotenv.config();
database.connect();

const PORT = process.env.PORT;
const app = express();

app.use(express.json());

app.use('/api', apiRouter);
app.use('/', (req, res) => {
    res.status(400).send({error: "Request URL cannot be found, please check the URL again!"})
})

app.listen(PORT, () => {
    console.log(`app listening on ${PORT}`)
})