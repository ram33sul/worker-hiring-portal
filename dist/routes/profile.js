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
router.put('/edit-profile', (0, account_1.eventHandler)(events_1.EDIT_PROFILE));
router.put('/register-as-worker', (0, account_1.eventHandler)(events_1.REGISTER_AS_WORKER));
router.patch('/open-to-work-on', (0, account_1.eventHandler)(events_1.OPEN_TO_WORK_ON));
router.patch('/open-to-work-off', (0, account_1.eventHandler)(events_1.OPEN_TO_WORK_OFF));
const profileRouter = router;
exports.default = profileRouter;
