import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

// Register a new user
export const registerUser = async (req, res) => {
  const {  email, password, fullName, phoneNumber } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, password: hashedPassword, fullName, phoneNumber });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: 'Registration failed' });
  }
};


// Login a user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' }); 
    }

    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' }); 
    }

  

    
    res.status(200).json({
      message: 'Login successful',
      user: { id: user._id, email: user.email, },
      
    });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ error: 'Login failed due to server error' });
  }
};

// Get user profile
export const getUserProfile = async (req, res) => {
  const { id } = req.params;

  // // Log the ID received in the request to ensure it's coming through correctly
  // console.log('Received ID:', id);

  // // Check if the ID is a valid MongoDB ObjectId
  // if (!mongoose.Types.ObjectId.isValid(id)) {
  //   return res.status(400).json({ message: 'Invalid user ID' });
  // }

  try {
    const user = await User.findById(id);

    // If the user is not found, send a 404 error
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      id: user.id,
      email: user.email,
      name: user.fullName,
      phoneNumber: user.phoneNumber,
      preferences: user.preferences,
    });
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  const { id } = req.params;
  const { email, password, fullName, phoneNumber, preferences } = req.body;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update fields if provided in the request
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);
    if (fullName) user.fullName = fullName;
    if (phoneNumber) {
      console.log('Updating phone number:', phoneNumber);  // Debugging log
      user.phoneNumber = phoneNumber;
    }

    if (preferences) {
      user.preferences = {
        ...user.preferences,
        ...preferences, // Merge preferences to update only specific ones
      };
    }

    await user.save();

    res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.fullName,
        phoneNumber: user.phoneNumber,
        preferences: user.preferences,
      },
    });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(400).json({ error: 'Update failed' });
  }
};

// Delete user account
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    await user.remove();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Deletion failed' });
  }
};

