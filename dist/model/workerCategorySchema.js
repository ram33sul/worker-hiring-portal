"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const workerCategorySchema = new mongoose_1.default.Schema({
    title: { type: String, require: true },
    skill: { type: String, require: true },
    dailyMinWage: { type: Number, default: 0 },
    hourlyMinWage: { type: Number, default: 0 },
    imageUrl: { type: String, default: '' }
});
const Worker = mongoose_1.default.model("worker", workerCategorySchema);
exports.default = Worker;
