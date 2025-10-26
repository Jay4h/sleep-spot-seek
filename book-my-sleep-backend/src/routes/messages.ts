import express from 'express';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

// @route   GET /api/messages
// @desc    Get messages
// @access  Private
router.get('/', authenticate, (req, res) => {
  res.json({ success: true, data: { messages: [] } });
});

export default router;
