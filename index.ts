import express from 'express';
import dotenv from 'dotenv';
import database from './config/database';
import accountRouter from './routes/account';

dotenv.config();
database.connect();

const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use('/', accountRouter);

app.listen(PORT, () => {
    console.log(`app listening on ${PORT}`)
})