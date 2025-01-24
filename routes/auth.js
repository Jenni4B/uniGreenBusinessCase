import express from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/user.js';
import { ensureGuest } from '../middleware/authEnsure.js';

const router = express.Router();

// Add route logic here

export default router;