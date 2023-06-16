import express from 'express';
import { eventHandler } from '../controllers/account';
import { ADD_RATING, GET_RATINGS } from '../controllers/events';
import { auth } from '../authentication/auth';

const router = express.Router();

router.use(auth);

router.post('add-rating', eventHandler(ADD_RATING));

router.get('get-ratings', eventHandler(GET_RATINGS));

const ratingRouter = router;

export default ratingRouter;