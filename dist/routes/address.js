"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../authentication/auth");
const account_1 = require("../controllers/account");
const events_1 = require("../controllers/events");
const router = express_1.default.Router();
router.use(auth_1.auth);
router.post('/add-address', (0, account_1.eventHandler)(events_1.ADD_ADDRESS));
router.get('/get-all-addresses', (0, account_1.eventHandler)(events_1.GET_ALL_ADDRESSES));
router.get('/get-address', (0, account_1.eventHandler)(events_1.GET_ADDRESS));
const addressRouter = router;
exports.default = addressRouter;
