
import express from 'express';
import bcrypt from 'bcryptjs';
import Parent from '../models/Parent.js';
import mongoose from 'mongoose';

const router = express.Router();

// Create a secure login session for a parent.
function startParentSession(req, parent, res) {
  req.session.regenerate((error) => {
    if (error) {
      console.error('Parent session regeneration error:', error.message);

      return res.status(500).json({
        success: false,
        message: 'Could not create a login session.'
      });
    }

    req.session.isParent = true;
    req.session.parentId = parent._id.toString();

    req.session.save((saveError) => {
      if (saveError) {
        console.error('Parent session save error:', saveError.message);

        return res.status(500).json({
          success: false,
          message: 'Could not save your login session.'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'You are logged in successfully.',
        parent: {
          id: parent._id.toString(),
          name: parent.name,
          email: parent.email
        }
      });
    });
  });
}

// PARENT SIGNUP
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !name.trim() ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please enter your name, email and password.'
      });
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();

    if (cleanName.length > 100 || cleanEmail.length > 254) {
      return res.status(400).json({
        success: false,
        message: 'Your name or email is too long.'
      });
    }

    // Validate the email address.
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.'
      });
    }

    if (password.length < 8 || password.length > 128) {
      return res.status(400).json({
        success: false,
        message: 'Password must be between 8 and 128 characters.'
      });
    }

    // Prevent duplicate accounts.
    const existingParent = await Parent.findOne({
      email: cleanEmail
    });

    if (existingParent) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists. Please log in.'
      });
    }

    // Never store the original password.
    const passwordHash = await bcrypt.hash(password, 12);

    const parent = await Parent.create({
      name: cleanName,
      email: cleanEmail,
      passwordHash
    });

    // Automatically log the parent in after signup.
    return startParentSession(req, parent, res);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists. Please log in.'
      });
    }

    console.error('Parent signup error:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Could not create your account. Please try again.'
    });
  }
});

// PARENT LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== 'string' ||
      typeof password !== 'string' ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        success: false,
        message: 'Enter your email and password.'
      });
    }

    const parent = await Parent.findOne({
      email: email.trim().toLowerCase()
    }).select('+passwordHash');

    if (
      !parent ||
      !parent.passwordHash ||
      !(await bcrypt.compare(password, parent.passwordHash))
    ) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    return startParentSession(req, parent, res);
  } catch (error) {
    console.error('Parent login error:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Could not log in. Please try again.'
    });
  }
});

// CHECK CURRENT PARENT SESSION
router.get('/me', async (req, res) => {
  try {
    if (!req.session?.isParent || !req.session.parentId) {
      return res.status(401).json({
        success: false,
        message: 'Please log in.'
      });
    }

    const parent = await Parent.findById(req.session.parentId);

    if (!parent) {
      delete req.session.isParent;
      delete req.session.parentId;

      return req.session.save(() => {
        return res.status(401).json({
          success: false,
          message: 'Parent account not found. Please log in again.'
        });
      });
    }

    return res.status(200).json({
      success: true,
      parent: {
        id: parent._id.toString(),
        name: parent.name,
        email: parent.email
      }
    });
  } catch (error) {
    console.error('Parent session check error:', error.message);

    return res.status(500).json({
      success: false,
      message: 'Could not check your login session.'
    });
  }
});


// Allow a signed-in parent to update basic account details.
router.patch('/profile', async (req, res) => {
  try {
    if (!req.session?.isParent || !req.session.parentId) return res.status(401).json({ success: false, message: 'Please log in.' });
    const { name, email } = req.body;
    if (typeof name !== 'string' || !name.trim() || typeof email !== 'string' || !email.trim()) return res.status(400).json({ success: false, message: 'Enter your name and email address.' });
    const cleanName = name.trim(); const cleanEmail = email.trim().toLowerCase();
    if (cleanName.length > 100 || cleanEmail.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) return res.status(400).json({ success: false, message: 'Enter a valid name and email address.' });
    const duplicate = await Parent.findOne({ email: cleanEmail, _id: { $ne: req.session.parentId } });
    if (duplicate) return res.status(409).json({ success: false, message: 'That email address is already used by another account.' });
    const parent = await Parent.findByIdAndUpdate(req.session.parentId, { name: cleanName, email: cleanEmail }, { new: true, runValidators: true });
    if (!parent) return res.status(404).json({ success: false, message: 'Parent account not found.' });
    return res.json({ success: true, parent: { id: parent._id.toString(), name: parent.name, email: parent.email } });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ success: false, message: 'That email address is already used by another account.' });
    console.error('Parent profile update error:', error.message);
    return res.status(500).json({ success: false, message: 'Could not update your profile.' });
  }
});

// Parent dashboard: only return appointments linked to the signed-in parent.
router.get('/my-appointments', async (req, res) => {
  try {
    if (!req.session?.isParent || !req.session.parentId) return res.status(401).json({ success: false, message: 'Please log in.' });
    const parentId = new mongoose.Types.ObjectId(req.session.parentId);
    const appointments = await mongoose.connection.db.collection('appointment').find({ parentId }).sort({ createdAt: -1 }).limit(100).toArray();
    return res.json({ success: true, appointments });
  } catch (error) {
    console.error('Parent appointment history error:', error.message);
    return res.status(500).json({ success: false, message: 'Could not load your appointment history.' });
  }
});

// PARENT LOGOUT
router.post('/logout', (req, res) => {
  if (!req.session) {
    return res.json({ success: true });
  }

  delete req.session.isParent;
  delete req.session.parentId;

  req.session.save((error) => {
    if (error) {
      console.error('Parent logout error:', error.message);

      return res.status(500).json({
        success: false,
        message: 'Could not log out.'
      });
    }

    return res.json({
      success: true,
      message: 'Parent logged out successfully.'
    });
  });
});

export default router;
