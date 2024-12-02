import express from 'express';
import { subscribeToAlert, unsubscribeFromAlert, checkIfUserIsSubscribed } from '../controllers/userSubscription.js';

const router = express.Router();

// Register a new subscriber
router.post('/', subscribeToAlert);
router.delete('/', unsubscribeFromAlert);
router.post('/check', checkIfUserIsSubscribed);



export default router;