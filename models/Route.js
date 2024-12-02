import mongoose from 'mongoose';

const routeSchema = new mongoose.Schema({
  origin: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }, 
    name: { type: String, required: true }, 
  },
  destination: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }, 
    name: { type: String, required: true }, 
  },
  // waypoints: [
  //   {
  //     lat: { type: Number, required: true }, 
  //     lng: { type: Number, required: true }, 
  //     name: { type: String, required: true }, 
  //   },
  // ],
  riskLevel: {
    type: String,
    enum: ['Low', 'Medium', 'High'], 
    required: true, 
  },
  createdAt: {
    type: Date,
    default: Date.now, 
  },
});

export default mongoose.model('Route', routeSchema);
