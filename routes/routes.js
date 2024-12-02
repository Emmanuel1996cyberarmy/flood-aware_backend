import express from 'express';
import { getRoutes, createRoute, deleteRoute } from '../controllers/routeController.js';

const router = express.Router();

// Get all routes
router.get('/route', getRoutes);

// Create a new route
router.post('/route', createRoute);

// Delete a route
router.delete('/route/:id', deleteRoute);

export default router;
