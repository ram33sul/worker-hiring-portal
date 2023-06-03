import express from 'express';
import accountRouter from './account';
import profileRouter from './profile';
import workerRouter from './worker';

const app = express();

app.use('/auth', accountRouter);
app.use('/profile', profileRouter);
app.use('/worker', workerRouter);

const apiRouter = app;

export default apiRouter;