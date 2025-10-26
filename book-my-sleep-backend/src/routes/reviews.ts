import express from 'express';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

// @route   GET /api/reviews
// @desc    Get reviews
// @access  Public
router.get('/', (req, res) => {
  res.json({ success: true, data: { reviews: [] } });
});

export default router;
