import express from 'express';
import { eventHandler } from '../controllers/account';
import { EDIT_PROFILE, GET_USER_DETAILS, OPEN_TO_WORK_OFF, OPEN_TO_WORK_ON, REGISTER_AS_WORKER } from '../controllers/events';
import { auth } from '../authentication/auth';
import { fileUploadMulter, fileUploadMulterField } from '../services/multer';

const router = express.Router();

router.use(auth);

router.put('/edit-user-profile', fileUploadMulter('profilePicture'), eventHandler(EDIT_PROFILE));

router.put('/register-as-worker', fileUploadMulterField(['profilePicture', 'identity']), (req, res) => {}, eventHandler(REGISTER_AS_WORKER));

router.patch('/open-to-work-on', eventHandler(OPEN_TO_WORK_ON));

router.patch('/open-to-work-off', eventHandler(OPEN_TO_WORK_OFF));

router.get('/get-user-details', eventHandler(GET_USER_DETAILS));

const profileRouter = router;

export default profileRouter;