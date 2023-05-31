import express from 'express';
import { eventHandler } from '../controllers/account';
import { EDIT_PROFILE, OPEN_TO_WORK_OFF, OPEN_TO_WORK_ON, REGISTER_AS_WORKER } from '../controllers/events';
import { auth } from '../authentication/auth';

const router = express.Router();

router.use(auth);

router.put('/edit-profile', eventHandler(EDIT_PROFILE));

router.put('/register-as-worker', eventHandler(REGISTER_AS_WORKER));

router.patch('/open-to-work-on', eventHandler(OPEN_TO_WORK_ON));

router.patch('/open-to-work-off', eventHandler(OPEN_TO_WORK_OFF));

const profileRouter = router;

export default profileRouter;