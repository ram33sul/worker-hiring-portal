"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const account_1 = require("../controllers/account");
const events_1 = require("../controllers/events");
const router = express_1.default.Router();
router.post('/add-worker-category', (0, account_1.eventHandler)(events_1.ADD_WORKER_CATEGORY));
router.get('/get-worker-categories', (0, account_1.eventHandler)(events_1.GET_WORKER_CATEGORIES));
router.get('/get-suggested-categories', (0, account_1.eventHandler)(events_1.GET_SUGGESTED_CATEGORIES));
router.get('/category-search', (0, account_1.eventHandler)(events_1.CATEGORY_SEARCH));
const workerRouter = router;
exports.default = workerRouter;
