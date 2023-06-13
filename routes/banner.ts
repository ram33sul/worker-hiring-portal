import express from 'express';
import { eventHandler } from '../controllers/account';
import { ADD_BANNER, GET_BANNERS } from '../controllers/events';

const router = express.Router();

router.post('/add-banner', eventHandler(ADD_BANNER));

router.get('/get-banners', eventHandler(GET_BANNERS));

const bannerRouter = router;
export default bannerRouter;