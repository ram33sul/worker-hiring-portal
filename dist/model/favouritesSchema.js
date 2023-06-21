"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const favouritesSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Types.ObjectId, require: true },
    addedUserId: { type: mongoose_1.default.Types.ObjectId, require: true }
});
const Favourites = mongoose_1.default.model("favourites", favouritesSchema);
exports.default = Favourites;
