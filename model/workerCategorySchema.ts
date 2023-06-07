import mongoose from "mongoose";

const workerCategorySchema = new mongoose.Schema({
    title: { type: String, require: true},
    skill: { type: String, require: true},
    dailyMinWage: { type: Number, default: 0},
    hourlyMinWage: { type: Number, default: 0},
    imageUrl: { type: String, default: ''}
})

const Worker = mongoose.model("worker", workerCategorySchema);

export default Worker;