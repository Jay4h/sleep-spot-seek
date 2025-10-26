import express from 'express';
import { authenticate } from '../middlewares/auth';

const router = express.Router();

// @route   POST /api/payments/create-intent
// @desc    Create payment intent
// @access  Private
router.post('/create-intent', authenticate, (req, res) => {
  res.json({ success: true, data: { clientSecret: 'pi_test_...' } });
});

export default router;
