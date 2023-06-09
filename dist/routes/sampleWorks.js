"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const account_1 = require("../controllers/account");
const events_1 = require("../controllers/events");
const auth_1 = require("../authentication/auth");
const multer_1 = require("../services/multer");
const router = (0, express_1.Router)();
router.use(auth_1.auth);
router.post('/add-sample-work', (0, multer_1.fileUploadMulter)('sampleWorkImage'), (0, account_1.eventHandler)(events_1.ADD_SAMPLE_WORK));
router.get('/get-sample-works', (0, account_1.eventHandler)(events_1.GET_SAMPLE_WORKS));
router.get('/get-sample-work', (0, account_1.eventHandler)(events_1.GET_SAMPLE_WORK));
router.delete('/delete-sample-work', (0, account_1.eventHandler)(events_1.DELETE_SAMPLE_WORK));
const sampleWorkRouter = router;
exports.default = sampleWorkRouter;
