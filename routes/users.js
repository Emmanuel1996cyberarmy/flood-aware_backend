import express from 'express';
import { registerUser, loginUser, getUserProfile, updateUserProfile, deleteUser } from '../controllers/userController.js';

const router = express.Router();

// Register a new user
router.post('/register', registerUser);

// Log in an existing user
router.post('/login', loginUser);

// Get user profile
router.get('/:id', getUserProfile);

router.put('/:id', updateUserProfile);

// Delete user account
router.delete('/:id', deleteUser); 

export default router;
