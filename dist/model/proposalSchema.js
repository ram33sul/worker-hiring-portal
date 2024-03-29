"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const proposalSchema = new mongoose_1.default.Schema({
    userId: { type: mongoose_1.default.Types.ObjectId, required: true },
    workerId: { type: mongoose_1.default.Types.ObjectId, required: true },
    chosenCategoryId: { type: mongoose_1.default.Types.ObjectId, required: true },
    wage: { type: Number, required: true },
    isFullDay: { type: Boolean, required: true },
    isBeforeNoon: { type: Boolean, default: true },
    isAccepted: { type: Boolean, default: false },
    isRejected: { type: Boolean, default: false },
    status: { type: Boolean, default: true },
    timestamp: { type: Date, default: new Date() },
    proposedDate: { type: Number, required: true },
    workDescription: { type: String, default: '' },
    proposedAddressId: { type: mongoose_1.default.Types.ObjectId, required: true },
    isUserDeleted: { type: Boolean, default: false },
    isWorkerDeleted: { type: Boolean, default: false },
    isCompleted: { type: Boolean, default: false }
});
const Proposal = mongoose_1.default.model("proposals", proposalSchema);
exports.default = Proposal;
