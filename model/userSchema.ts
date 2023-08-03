import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    firstName: { type: String, default: ''},
    lastName: { type: String, default: ''},
    phone: { type: String },
    countryCode: { type: String },
    status: { type: Boolean, default: true},
    email: { type: String, default: ''},
    isWorker: { type: Boolean, default: false},
    isVerified: { type: Boolean, default: false},
    gender: { type: String, default: ''},
    profilePicture: { type: String, default: 'https://res.cloudinary.com/doazsqomm/image/upload/v1687345529/fix_it_now_default_profile_pciture_dxl6to.png'},
    bio: { type: String, default: ''},
    age: { type: Number, default: 0},
    categoryList: { type: Array, default: []},
    dailyWage: { type: Number, default: 0},
    hourlyWage: { type: Number, default: 0},
    primaryCategory: { type: mongoose.Types.ObjectId, default: null},
    openToWork: { type: Boolean, default: false},
    selectedAddress: { type: mongoose.Types.ObjectId, default: null},
    identityUrl: { type: String, default: ''}
})

const User = mongoose.model("user", userSchema);

export default User;