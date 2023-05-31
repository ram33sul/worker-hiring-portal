import express from 'express';
import dotenv from 'dotenv';
import database from './config/database';
import accountRouter from './routes/account';
import profileRouter from './routes/profile';

dotenv.config();
database.connect();

const PORT = process.env.PORT;
const app = express();

app.use(express.json());
app.use('/', accountRouter);
app.use('/', profileRouter);

app.listen(PORT, () => {
    console.log(`app listening on ${PORT}`)
})