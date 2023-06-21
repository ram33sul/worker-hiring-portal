import express from 'express';
import { eventHandler } from '../controllers/account';
import { ADD_WORKER_CATEGORY, CATEGORY_SEARCH, GET_SUGGESTED_CATEGORIES, GET_WORKER_CATEGORIES } from '../controllers/events';
import { auth } from '../authentication/auth';

const router = express.Router();

router.post('/add-worker-category',(req, res, next) => {
    if(req.body.password === process.env.ADMIN_PASSWORD){
        next();
    } else {
        res.status(401).send("unauthorized")
    }
}, eventHandler(ADD_WORKER_CATEGORY))

router.use(auth);

router.get('/get-worker-categories', eventHandler(GET_WORKER_CATEGORIES));

router.get('/get-suggested-categories', eventHandler(GET_SUGGESTED_CATEGORIES));

router.get('/category-search', eventHandler(CATEGORY_SEARCH));

const workerRouter = router;

export default workerRouter;