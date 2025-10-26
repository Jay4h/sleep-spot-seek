import express from 'express';
import { authenticate, authorize } from '../middlewares/auth';

const router = express.Router();

// @route   GET /api/properties
// @desc    Get all properties
// @access  Public
router.get('/', (req, res) => {
  res.json({ success: true, data: { properties: [] } });
});

// @route   POST /api/properties
// @desc    Create property
// @access  Private (Owner)
router.post('/', authenticate, authorize('owner'), (req, res) => {
  res.json({ success: true, message: 'Property created' });
});

export default router;
