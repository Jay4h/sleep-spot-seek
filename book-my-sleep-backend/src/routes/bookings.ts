import express from 'express';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

// @route   GET /api/bookings
// @desc    Get bookings
// @access  Private
router.get('/', authenticate, (req, res) => {
  res.json({ success: true, data: { bookings: [] } });
});

export default router;
