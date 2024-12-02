import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Name is required
  },
  state: {
    type: String,
    required: true, 
  },
  town: {
    type: String,
    required: true,
  },
  lga: {
    type: String,
    required: true, 
  },
  date: {
    type: Date,
    required: true, 
  },
  description: {
    type: String,
    
  },
  imageUrl: {
    type: String,
    required: true, 
    validate: {
      validator: function (v) {
        // Accept Base64 string or URL
        return (
          /^data:image\/(jpeg|jpg|png|gif);base64,[a-zA-Z0-9+/=]+$/.test(v) || 
          /^https?:\/\/.+\.(jpg|jpeg|png|gif)$/i.test(v)
        );
      },
      message: (props) =>
        `${props.value} is not a valid image format! Must be Base64 or a valid image URL.`,
    },
  },
  severity: {
    type: String,
    enum: ["high", "medium", "low"], 
    required: true, // Severity is required
  },
  coordinates: {
    lat: { type: Number}, 
    lng: { type: Number }, 
  },
  anonymous: {
    type: Boolean,
    default: false, // Default to not anonymous
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Reference to User model
  },
  timestamp: {
    type: Date,
    default: Date.now, 
  },
});

const Report = mongoose.model("Report", reportSchema);
export default Report;
