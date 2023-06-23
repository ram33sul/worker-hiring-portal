import { Router } from 'express';
import { eventHandler } from '../controllers/account';
import { ADD_SAMPLE_WORK, DELETE_SAMPLE_WORK, GET_SAMPLE_WORK, GET_SAMPLE_WORKS } from '../controllers/events';
import { auth } from '../authentication/auth';

const router = Router();

router.use(auth);

router.post('/add-sample-work', eventHandler(ADD_SAMPLE_WORK));

router.get('/get-sample-works', eventHandler(GET_SAMPLE_WORKS));

router.get('/get-sample-work', eventHandler(GET_SAMPLE_WORK));

router.delete('/delete-sample-work', eventHandler(DELETE_SAMPLE_WORK));

export default router;