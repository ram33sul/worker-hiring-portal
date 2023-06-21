import { Router } from 'express';
import { auth } from '../authentication/auth';
import { eventHandler } from '../controllers/account';
import { ADD_TO_FAVOURITES, GET_FAVOURITES } from '../controllers/events';

const router = Router();

router.use(auth);

router.post('/add-to-favourites', eventHandler(ADD_TO_FAVOURITES));

router.get('/get-favourites', eventHandler(GET_FAVOURITES));

const favouritesRouter = router;

export default favouritesRouter;