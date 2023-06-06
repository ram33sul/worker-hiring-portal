import express from 'express';
import { eventHandler } from '../controllers/account';
import { ADD_WORKER_CATEGORY, GET_WORKER_CATEGORIES } from '../controllers/events';

const router = express.Router();

router.post('/add-worker-category', eventHandler(ADD_WORKER_CATEGORY))

router.get('/get-worker-categories', eventHandler(GET_WORKER_CATEGORIES));

const workerRouter = router;

export default workerRouter;