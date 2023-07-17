"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const account_1 = require("../controllers/account");
const events_1 = require("../controllers/events");
const auth_1 = require("../authentication/auth");
const router = express_1.default.Router();
router.use(auth_1.auth);
router.post("/add-proposal", (0, account_1.eventHandler)(events_1.ADD_PROPOSAL));
router.get("/get-proposals", (0, account_1.eventHandler)(events_1.GET_PROPOSALS));
router.patch("/accept-proposal", (0, account_1.eventHandler)(events_1.ACCEPT_PROPOSAL));
router.patch("/reject-proposal", (0, account_1.eventHandler)(events_1.REJECT_PROPOSAL));
const proposalRouter = router;
exports.default = proposalRouter;
