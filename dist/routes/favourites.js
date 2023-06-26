"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../authentication/auth");
const account_1 = require("../controllers/account");
const events_1 = require("../controllers/events");
const router = (0, express_1.Router)();
router.use(auth_1.auth);
router.post('/add-to-favourites', (0, account_1.eventHandler)(events_1.ADD_TO_FAVOURITES));
router.get('/get-favourites', (0, account_1.eventHandler)(events_1.GET_FAVOURITES));
router.delete('/remove-from-favourites', (0, account_1.eventHandler)(events_1.REMOVE_FROM_FAVOURITES));
const favouritesRouter = router;
exports.default = favouritesRouter;
