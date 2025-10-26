import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { config } from '../config/config';
import User from '../models/User';
import { ApiResponse, JWTPayload } from '../types';

// Generate JWT token
const generateToken = (userId: string): string => {
  return jwt.sign({ userId }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
};

// Generate refresh token
const generateRefreshToken = (userId: string): string => {
  return jwt.sign({ userId }, config.jwt.refreshSecret, { expiresIn: config.jwt.refreshExpiresIn });
};

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req: Request, res: Response): Promise<void> => {
  const { firstName, lastName, email, password, phoneNumber, role, address } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400).json({
      success: false,
      error: 'User already exists with this email'
    });
    return;
  }

  // Create user
  const user = new User({
    firstName,
    lastName,
    email,
    password,
    phoneNumber,
    role,
    address: address || {
      street: '',
      city: '',
      state: '',
      country: 'India',
      zipCode: '',
      coordinates: { lat: 0, lng: 0 }
    }
  });

  await user.save();

  // Generate tokens
  const token = generateToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  const response: ApiResponse = {
    success: true,
    data: {
      user: user.getPublicProfile(),
      token,
      refreshToken
    },
    message: 'User registered successfully'
  };

  res.status(201).json(response);
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  // Find user and include password
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    res.status(401).json({
      success: false,
      error: 'Invalid credentials'
    });
    return;
  }

  // Check password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    res.status(401).json({
      success: false,
      error: 'Invalid credentials'
    });
    return;
  }

  // Generate tokens
  const token = generateToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  const response: ApiResponse = {
    success: true,
    data: {
      user: user.getPublicProfile(),
      token,
      refreshToken
    },
    message: 'Login successful'
  };

  res.status(200).json(response);
};

// @desc    Refresh access token
// @route   POST /api/auth/refresh
// @access  Public
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  const { refreshToken } = req.body;

  try {
    const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as JWTPayload;
    const user = await User.findById(decoded.userId);

    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Invalid refresh token'
      });
      return;
    }

    // Generate new access token
    const newToken = generateToken(user._id);

    const response: ApiResponse = {
      success: true,
      data: {
        token: newToken
      },
      message: 'Token refreshed successfully'
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Invalid refresh token'
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req: Request, res: Response): Promise<void> => {
  // In a real application, you would blacklist the token
  // For now, we'll just return success
  const response: ApiResponse = {
    success: true,
    message: 'Logout successful'
  };

  res.status(200).json(response);
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req: Request, res: Response): Promise<void> => {
  const response: ApiResponse = {
    success: true,
    data: {
      user: req.user.getPublicProfile()
    }
  };

  res.status(200).json(response);
};
