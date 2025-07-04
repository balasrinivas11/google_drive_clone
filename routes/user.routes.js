const express = require('express');
const app = express();
const router = express.Router();
const {body, validationResult} = require('express-validator');
const User = require('../models/user.model');
const bcrypt= require('bcrypt');
const jwt= require('jsonwebtoken');



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

      const hashpassword= await bcrypt.hash(password, 10);
    try {
      const newUser = await User.create({
        username,
        email,
        password:hashpassword,
      });
      res.status(201).json({ message: 'User registered successfully', user: newUser });
    } catch (err) {
      res.status(500).json({ error: 'Server error', details: err.message });
    }
  }
);

router.get('/login', (req, res) => {
  res.render('login');  
});

router.post('/login',body('username').trim().isLength({ min: 3 }),
body('password').trim().isLength({ min: 5 }),
async (req,res)=>{
  const errors=validationResult(req);
  if(!errors.isEmpty()){  
    return res.status(400).json({ errors: errors.array(),message: 'Invalid input' });
  }
  const {username,password}=req.body;
  const user= await User.findOne({username});
  if(!user){
    res.status(400).json({message: 'Username is incorrect'});
  }else{
    const match= await bcrypt.compare(password,user.password);
    if(!match){
      res.status(400).json({message: 'password is incorrect'});
    }
      const token = jwt.sign(
        { userId: user._id, username: user.username, email: user.email },
        process.env.JWT_SECRET
      );
      res.cookie('token', token);
      res.status(200).json({ message: 'Login successful', token });
       
  }
});

module.exports = router;