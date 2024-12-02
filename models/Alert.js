import mongoose from 'mongoose';

const alertSchema = new mongoose.Schema({
  severity: { type: String, required: true }, // e.g., critical, warning, advisory
  location: { type: String, required: true },
  message: { type: String, required: true },
  source: { type: String, default: 'OpenWeatherMap' },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

const Alert = mongoose.model('Alert', alertSchema);
export default Alert;
