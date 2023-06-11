import express from 'express';
import { auth } from '../authentication/auth';
import { eventHandler } from '../controllers/account';
import { ADD_ADDRESS, GET_ADDRESS, GET_ALL_ADDRESSES } from '../controllers/events';

const router = express.Router();

router.use(auth);

router.post('/add-address', eventHandler(ADD_ADDRESS));

router.get('/get-all-addresses', eventHandler(GET_ALL_ADDRESSES));

router.get('/get-address', eventHandler(GET_ADDRESS));

const addressRouter = router;

export default addressRouter;