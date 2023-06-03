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

app.listen(PORT, () => {
    console.log(`app listening on ${PORT}`)
})