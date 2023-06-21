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
router.post('/add-rating', (0, account_1.eventHandler)(events_1.ADD_RATING));
router.get('/get-ratings', (0, account_1.eventHandler)(events_1.GET_RATINGS));
const ratingRouter = router;
exports.default = ratingRouter;
