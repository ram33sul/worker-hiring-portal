import express from 'express';
import accountRouter from './account';
import profileRouter from './profile';
import workerRouter from './worker';
import addressRouter from './address';
import bannerRouter from './banner';

const app = express();

app.use('/auth', accountRouter);
app.use('/profile', profileRouter);
app.use('/worker', workerRouter);
app.use('/address', addressRouter);
app.use('/banner', bannerRouter);


const apiRouter = app;

export default apiRouter;