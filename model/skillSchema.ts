import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
    name: { type: String, require: true},
    picture: { type: String, default: ''}
})

const Skill = mongoose.model("skill", skillSchema);

export default Skill;