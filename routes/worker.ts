import express from 'express';
import { eventHandler } from '../controllers/account';
import { ADD_WORKER_CATEGORY, CATEGORY_SEARCH, GET_SUGGESTED_CATEGORIES, GET_WORKER_CATEGORIES } from '../controllers/events';

const router = express.Router();

router.post('/add-worker-category', eventHandler(ADD_WORKER_CATEGORY))

router.get('/get-worker-categories', eventHandler(GET_WORKER_CATEGORIES));

router.get('/get-suggested-categories', eventHandler(GET_SUGGESTED_CATEGORIES));

router.get('/category-search', eventHandler(CATEGORY_SEARCH));

const workerRouter = router;

export default workerRouter;