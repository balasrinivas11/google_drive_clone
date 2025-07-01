const express = require('express');
const app = express();
const router = express.Router();
const {body, validationResult} = require('express-validator');
const User = require('../models/user.model');



router.get('/register', (req, res) => {
  res.render('register');  
});

router.post(
  '/register',
  body('email').trim().isEmail(),
  body('password').trim().isLength({ min: 5 }),
  body('username').trim().isLength({ min: 1 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
      const newUser = await User.create({
        username,
        email,
        password,
      });
      res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (err) {
      res.status(500).json({ error: 'Server error', details: err.message });
    }
  }
);

module.exports = router;