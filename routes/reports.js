import express from 'express';
import {
  getReports,
  createReport,
  updateReport,
  deleteReport,
} from '../controllers/reportController.js';

const router = express.Router();

// Get all reports
router.get('/', getReports);

// Submit a new report
router.post('/', createReport);

// Update a report (e.g., status)
router.put('/:id', updateReport);

// Delete a report
router.delete('/:id', deleteReport);

export default router;
