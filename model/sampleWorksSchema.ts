import mongoose from "mongoose";

const sampleWorksSchema = new mongoose.Schema({
    title: { type: String, default: '' },
    description: { type: String, default: ''},
    timestamp: { type: Date, default: new Date()},
    userId: { type: mongoose.Types.ObjectId, require: true},
    imageUrl: { type: String, default: ''}
})

const SampleWorks = mongoose.model("sample-works", sampleWorksSchema);
export default SampleWorks;