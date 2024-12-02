import Report from '../models/Report.js';

// Fetch all reports with optional filtering and pagination
export const getReports = async (req, res) => {
  const { page = 1, limit = 10, severity, status } = req.query;
  const query = {};

  if (severity) query.severity = severity; 
  if (status) query.status = status; // Filter by status

  try {
    // Apply pagination after applying filters
    const reports = await Report.find(query)
      .skip((page - 1) * limit) 
      .limit(Number(limit)); 
    
    const total = await Report.countDocuments(query); 

    res.status(200).json({
      total,
      page: Number(page),
      limit: Number(limit),
      reports,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reports', details: err.message });
  }
};


// Create a new report
export const createReport = async (req, res) => {
 const {name, state, town, lga, date, description, imageUrl, severity, coordinates, anonymous, userId} = req.body;

  // Validate required fields
  if (!name || !state || !town || !lga || !date || !imageUrl  ) {
    return res.status(400).json({ error: 'Name, state, town/LGA, date, description, and image are required.'});
  }
 

  try {
    
    const report = new Report({ name, state, town, lga, date, description, imageUrl, severity, coordinates, anonymous, userId });
    await report.save();
    res.status(201).json(report);
  } catch (err) {
    console.error("Error creating report:", err);
    res.status(400).json({ error: 'Failed to create report', details: err.message });
  }
};

// Update a report
export const updateReport = async (req, res) => {
  const { id } = req.params;

  // Validate ID format
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: 'Invalid report ID format.' });
  }

  try {
    const updatedReport = await Report.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updatedReport) {
      return res.status(404).json({ error: 'Report not found.' });
    }
    res.status(200).json(updatedReport);
  } catch (err) {
    res.status(400).json({ error: 'Failed to update report', details: err.message });
  }
};

// Delete a report
export const deleteReport = async (req, res) => {
  const { id } = req.params;

  // Validate ID format
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ error: 'Invalid report ID format.' });
  }

  try {
    const deletedReport = await Report.findByIdAndDelete(id);
    if (!deletedReport) {
      return res.status(404).json({ error: 'Report not found.' });
    }
    res.status(200).send({ message: 'Report deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: 'Failed to delete report', details: err.message });
  }
};