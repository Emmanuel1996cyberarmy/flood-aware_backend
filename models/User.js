import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true, 
  },
  password: {
    type: String,
    required: true, 
  },
  fullName: {
    type: String, 
    trim: true,
  },
  phoneNumber: {
    type: String, 
    trim: true,
  },
  preferences: {
    emailNotifications: {
      type: Boolean,
      default: true, // Default to email notifications enabled
    },
    floodAlertsSubscribed: {
      type: Boolean,
      default: false, // Default to not subscribed
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Automatically update on profile modification
  },
});

// Middleware to update `updatedAt` on save
userSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

const User = mongoose.model('User', userSchema);

export default User;

