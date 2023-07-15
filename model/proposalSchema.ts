import mongoose from "mongoose";

const proposalSchema = new mongoose.Schema({
    WorkerId: { type: mongoose.Types.ObjectId, required: true},
    chosenCategoryId: { type: mongoose.Types.ObjectId, required: true},
    Wage: { type: Number, required: true},
    isFullDay: { type: Boolean, required: true},
    isBeforeNoon: { type: Boolean, default: true},
    isAccepted: { type: Boolean, default: false},
    status: { type: String, default: true},
    timestamp: { type: Date, default: new Date()},
    proposedDate: { type: Date, default: new Date()},
    workDescription: { type: String, default: ''},
    proposedAddressId: { type: mongoose.Types.ObjectId, required: true}
})

const Proposal = mongoose.model("proposals", proposalSchema);

export default Proposal;