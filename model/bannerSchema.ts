import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema({
    title: {type: String, default: ''},
    description: {type: String, default: ''},
    imageUrl: {type: String, default: ''},
    deeplinkUrl: {type: String, default: ''}
});

const Banner = mongoose.model("banner", bannerSchema);
export default Banner;