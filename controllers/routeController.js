import Route from '../models/Route.js';

// @desc Get all routes with optional filtering and pagination
// @route GET /api/routes
// @access Public
export const getRoutes = async (req, res) => {
  const { page = 1, limit = 10, riskLevel } = req.query; // Pagination and filtering parameters
  const query = {};

  // Add filtering based on riskLevel if provided
  if (riskLevel) query.riskLevel = riskLevel;

  try {
    const routes = await Route.find(query)
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const total = await Route.countDocuments(query);

    res.status(200).json({
      total,
      page: Number(page),
      limit: Number(limit),
      routes,
    });
  } catch (error) {
    console.error('Error fetching routes:', error);
    res.status(500).json({ message: 'Failed to fetch routes', details: error.message });
  }
};

// @desc Create a new route
// @route POST /api/routes
// @access Public
export const createRoute = async (req, res) => {
  const { origin, destination,  riskLevel } = req.body;

  // Validate required fields
  if (!origin || !origin.lat || !origin.lng || !origin.name) {
    return res.status(400).json({ error: 'Origin must include latitude, longitude, and name.' });
  }
  if (!destination || !destination.lat || !destination.lng || !destination.name) {
    return res.status(400).json({ error: 'Destination must include latitude, longitude, and name.' });
  }
  if (!riskLevel) {
    return res.status(400).json({ error: 'Risk level is required.' });
  }

  try {
    const newRoute = new Route({ origin, destination,  riskLevel });
    await newRoute.save(); // Save the route to the database
    res.status(201).json({ message: 'Route created successfully', route: newRoute });
  } catch (error) {
    console.error('Error creating route:', error);
    res.status(400).json({ message: 'Failed to create route', details: error.message });
  }
};

// @desc Update a route
// @route PUT /api/routes/:id
// @access Public
export const updateRoute = async (req, res) => {
  const { id } = req.params;

  // Validate ID format
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: 'Invalid route ID format.' });
  }

  try {
    const updatedRoute = await Route.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updatedRoute) {
      return res.status(404).json({ message: 'Route not found.' });
    }
    res.status(200).json({ message: 'Route updated successfully', route: updatedRoute });
  } catch (error) {
    console.error('Error updating route:', error);
    res.status(400).json({ message: 'Failed to update route', details: error.message });
  }
};

// @desc Delete a route
// @route DELETE /api/routes/:id
// @access Public
export const deleteRoute = async (req, res) => {
  const { id } = req.params;

  // Validate ID format
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: 'Invalid route ID format.' });
  }

  try {
    const deletedRoute = await Route.findByIdAndDelete(id); // Find and delete the route by ID
    if (!deletedRoute) {
      return res.status(404).json({ message: 'Route not found.' });
    }
    res.status(200).json({ message: 'Route deleted successfully' });
  } catch (error) {
    console.error('Error deleting route:', error);
    res.status(500).json({ message: 'Failed to delete route', details: error.message });
  }
};

// @desc Get a specific route by ID
// @route GET /api/routes/:id
// @access Public
export const getRouteById = async (req, res) => {
  const { id } = req.params;

  // Validate ID format
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: 'Invalid route ID format.' });
  }

  try {
    const route = await Route.findById(id);
    if (!route) {
      return res.status(404).json({ message: 'Route not found.' });
    }
    res.status(200).json(route);
  } catch (error) {
    console.error('Error fetching route:', error);
    res.status(500).json({ message: 'Failed to fetch route', details: error.message });
  }
};
