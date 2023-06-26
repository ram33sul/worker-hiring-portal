import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, require: true},
    ratedUserId: { type: mongoose.Types.ObjectId, require: true},
    rating: { type: Number, require: true},
    review: { type: String, default: ''},
    isWorker: { type: Boolean, default: false},
    timestamp: { type: Date, default: new Date()}
})

const Rating = mongoose.model("rating", ratingSchema);
export default Rating;