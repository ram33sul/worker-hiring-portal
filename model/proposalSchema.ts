import mongoose from "mongoose";

const proposalSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, required: true},
    workerId: { type: mongoose.Types.ObjectId, required: true},
    chosenCategoryId: { type: mongoose.Types.ObjectId, required: true},
    wage: { type: Number, required: true},
    isFullDay: { type: Boolean, required: true},
    isBeforeNoon: { type: Boolean, default: true},
    isAccepted: { type: Boolean, default: false},
    isRejected: { type: Boolean, default: false},
    status: { type: String, default: true},
    timestamp: { type: Date, default: new Date()},
    proposedDate: { type: Date, default: new Date()},
    workDescription: { type: String, default: ''},
    proposedAddressId: { type: mongoose.Types.ObjectId, required: true},
    isUserDeleted: { type: Boolean, default: false},
    isWorkerDeleted: { type: Boolean, default: false}
})

const Proposal = mongoose.model("proposals", proposalSchema);

export default Proposal;