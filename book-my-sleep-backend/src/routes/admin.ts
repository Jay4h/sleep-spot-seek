import express from 'express';
import { authenticate, authorize } from '../middlewares/auth';

const router = express.Router();

// @route   GET /api/admin/analytics
// @desc    Get analytics
// @access  Private (Admin)
router.get('/analytics', authenticate, authorize('admin'), (req, res) => {
  res.json({ success: true, data: { analytics: {} } });
});

export default router;
