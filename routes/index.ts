import express from 'express';
import accountRouter from './account';
import profileRouter from './profile';
import workerRouter from './worker';
import addressRouter from './address';
import bannerRouter from './banner';
import ratingRouter from './rating';
import favouritesRouter from './favourites';
import sampleWorkRouter from './sampleWorks';

const app = express();

app.use('/auth', accountRouter);
app.use('/profile', profileRouter);
app.use('/worker', workerRouter);
app.use('/address', addressRouter);
app.use('/banner', bannerRouter);
app.use('/rating', ratingRouter);
app.use('/favourites', favouritesRouter);
app.use('/sample-work', sampleWorkRouter);

const apiRouter = app;

export default apiRouter;