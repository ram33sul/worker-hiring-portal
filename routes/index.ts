import express from 'express';
import accountRouter from './account';
import profileRouter from './profile';
import workerRouter from './worker';
import addressRouter from './address';

const app = express();

app.use('/auth', accountRouter);
app.use('/profile', profileRouter);
app.use('/worker', workerRouter);
app.use('/address', addressRouter);

const apiRouter = app;

export default apiRouter;