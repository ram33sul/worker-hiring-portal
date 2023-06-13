"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const account_1 = require("../controllers/account");
const events_1 = require("../controllers/events");
const router = express_1.default.Router();
router.post('/add-banner', (0, account_1.eventHandler)(events_1.ADD_BANNER));
router.get('/get-banners', (0, account_1.eventHandler)(events_1.GET_BANNERS));
const bannerRouter = router;
exports.default = bannerRouter;
