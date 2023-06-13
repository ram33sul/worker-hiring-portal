import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
    title: { type: String, default: ''},
    completeAddress: { type: String, default: ''},
    floor: { type: String, default: ''},
    landmark: { type: String, default: ''},
    place: { type: String, default: ''},
    subLocality: { type: String, default: ''},
    city: { type: String, default: ''},
    state: { type: String, default: ''},
    country: { type: String, default: ''},
    pin: { type: Number, default: ''},
    location: { type: Array, default: [0,0]}
})

const Address = mongoose.model("address", addressSchema);

export default Address;