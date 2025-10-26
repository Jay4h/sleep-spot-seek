import express from 'express';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', authenticate, (req, res) => {
  res.json({ success: true, data: { user: req.user } });
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', authenticate, (req, res) => {
  res.json({ success: true, message: 'Profile updated' });
});

export default router;
