const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { passport, samlEnabled } = require('../config/passport-saml');
const { findUserByEmail, createLocalUser } = require('../models/userModel');
const { verifyToken } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password, fullName } = req.body;
    if (!email || !password || !fullName) {
      return res.status(400).json({ message: 'email, password and fullName are required' });
    }

    const existing = await findUserByEmail(email);
    if (existing) return res.status(409).json({ message: 'User already exists' });

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await createLocalUser({ email, passwordHash, fullName });

    return res.status(201).json({ message: 'User registered successfully', user });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);

    if (!user || user.auth_provider !== 'local') {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { sub: user.id, email: user.email, fullName: user.full_name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );

    return res.json({ token, user: { id: user.id, email: user.email, fullName: user.full_name } });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// ---- Current user (used by Dashboard to display greeting) ----
router.get('/me', verifyToken, (req, res) => {
  const { sub, email, fullName, provider } = req.user;
  return res.json({
    id: sub,
    email,
    fullName,
    provider: provider || 'local',
  });
});

router.get('/saml/login', (req, res, next) => {
  if (!samlEnabled) {
    return res.status(503).json({
      message: 'SAML is not configured yet. Provide a valid IdP certificate at SAML_CERT_PATH.',
    });
  }
  return passport.authenticate('saml', { failureRedirect: '/api/auth/saml/failure' })(req, res, next);
});

router.post(
  '/saml/callback',
  (req, res, next) => {
    if (!samlEnabled) {
      return res.status(503).json({ message: 'SAML is not configured yet.' });
    }
    return passport.authenticate('saml', { failureRedirect: '/api/auth/saml/failure', session: false })(req, res, next);
  },
  (req, res) => {
    const user = req.user;
    const token = jwt.sign(
      { sub: user.id, email: user.email, fullName: user.full_name, provider: 'saml' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    res.redirect(`${process.env.FRONTEND_URL}/auth/callback?token=${token}`);
  }
);

router.get('/saml/failure', (req, res) => {
  res.status(401).json({ message: 'SAML authentication failed' });
});

module.exports = router;