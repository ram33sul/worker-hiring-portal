"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const account_1 = require("../controllers/account");
const events_1 = require("../controllers/events");
const auth_1 = require("../authentication/auth");
const multer_1 = require("../services/multer");
const router = express_1.default.Router();
router.use(auth_1.auth);
router.put('/edit-user-profile', (0, multer_1.fileUploadMulter)('profilePicture'), (0, account_1.eventHandler)(events_1.EDIT_PROFILE));
router.put('/register-as-worker', (0, multer_1.fileUploadMulterField)(['profilePicture', 'identity']), (0, account_1.eventHandler)(events_1.REGISTER_AS_WORKER));
router.patch('/open-to-work-on', (0, account_1.eventHandler)(events_1.OPEN_TO_WORK_ON));
router.patch('/open-to-work-off', (0, account_1.eventHandler)(events_1.OPEN_TO_WORK_OFF));
router.get('/get-user-details', (0, account_1.eventHandler)(events_1.GET_USER_DETAILS));
const profileRouter = router;
exports.default = profileRouter;
