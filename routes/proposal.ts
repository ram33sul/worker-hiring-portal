import express from 'express';
import { eventHandler } from '../controllers/account';
import { ACCEPT_PROPOSAL, ADD_PROPOSAL, COMPLETE_PROPOSAL, GET_PROPOSALS, GET_REPORT, REJECT_PROPOSAL } from '../controllers/events';
import { auth } from '../authentication/auth';

const router = express.Router();

router.use(auth)

router.post("/add-proposal", eventHandler(ADD_PROPOSAL));

router.get("/get-proposals", eventHandler(GET_PROPOSALS));

router.patch("/accept-proposal", eventHandler(ACCEPT_PROPOSAL));

router.patch("/reject-proposal", eventHandler(REJECT_PROPOSAL));

router.patch("/complete-proposal", eventHandler(COMPLETE_PROPOSAL));

router.get("/get-report", eventHandler(GET_REPORT));

const proposalRouter = router;

export default proposalRouter;