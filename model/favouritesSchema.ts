import mongoose from "mongoose";

const favouritesSchema = new mongoose.Schema({
    userId: { type: mongoose.Types.ObjectId, require: true},
    addedUserId: { type: mongoose.Types.ObjectId, require: true}
})

const Favourites = mongoose.model("favourites", favouritesSchema);

export default Favourites;