import mongoose from "mongoose";

const SubscribeAlertSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    latitude: { type: Number, required: true },
     longitude: { type: Number, required: true },
    alertType: {type: String, default: 'flood'},

})

export default mongoose.model('SubscribeAlert', SubscribeAlertSchema)