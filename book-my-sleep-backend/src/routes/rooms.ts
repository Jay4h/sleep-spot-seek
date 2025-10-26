import express from 'express';
import { authenticate, authorize } from '../middlewares/auth';

const router = express.Router();

// @route   GET /api/rooms
// @desc    Get rooms
// @access  Public
router.get('/', (req, res) => {
  res.json({ success: true, data: { rooms: [] } });
});

export default router;
