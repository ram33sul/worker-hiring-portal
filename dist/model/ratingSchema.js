"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ratingSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Types.ObjectId, require: true },
    ratedUserId: { type: mongoose_1.default.Types.ObjectId, require: true },
    rating: { type: Number, require: true },
    review: { type: String, default: '' },
    isWorker: { type: Boolean, default: false },
    timestamp: { type: Date, default: new Date() }
});
const Rating = mongoose_1.default.model("rating", ratingSchema);
exports.default = Rating;
