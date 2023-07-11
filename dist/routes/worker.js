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
router.post('/add-worker-category', (req, res, next) => {
    if (req.body.password === process.env.ADMIN_PASSWORD) {
        next();
    }
    else {
        res.status(401).send("unauthorized");
    }
}, (0, account_1.eventHandler)(events_1.ADD_WORKER_CATEGORY));
router.use(auth_1.auth);
router.get('/get-worker-categories', (0, account_1.eventHandler)(events_1.GET_WORKER_CATEGORIES));
router.get('/get-suggested-categories', (0, account_1.eventHandler)(events_1.GET_SUGGESTED_CATEGORIES));
router.get('/category-search', (0, account_1.eventHandler)(events_1.CATEGORY_SEARCH));
router.get('/get-workers-list', (0, account_1.eventHandler)(events_1.GET_WORKERS_LIST));
const workerRouter = router;
exports.default = workerRouter;
