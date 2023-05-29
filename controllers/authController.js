const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { generateToken } = require('../helpers/jwt.js');

// exports.getSignUpPage = (req, res) => {
//   res.sendFile(path.join(__dirname, '../public', 'signUp.html'));
// };

exports.signUp = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    // Check if user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) 
    {
      return res.send('User with this email already exists');
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({ name, email, password: hashedPassword });
    const token = generateToken(newUser);                       // Generate JWT token
    newUser.token = token;

    await newUser.save();
    res.cookie('userId', newUser._id);            // Set the user ID in a cookie
    res.cookie('token', token);       
    res.redirect('/dashboard');              // Set the token in a cookie
    // res.send('Sign up successful');
    
  } catch (error) {
    console.error(error);
    res.send('An error occurred. Please try again.');
  }
};

exports.getLoginPage = (req, res) => {
  res.sendFile(path.join(__dirname, '../public', 'index.html'));
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find the user with matching email
    const user = await User.findOne({ email });
    if (user) 
    {
      // Compare the entered password with the hashed password
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (passwordMatch) 
      {
        const token = generateToken(user); // Generate JWT token
        user.token = token;
        await user.save();

        res.cookie('userId', user._id); // Set the user ID in a cookie
        res.cookie('token', token); // Set the token in a cookie
        res.redirect('/dashboard');
        // res.send('Login successful');
      } else {
        res.send('Invalid email or password');
      }
    } else {
      res.send('Invalid email or password');
    }
  } catch (error) {
    console.error(error);
    res.send('An error occurred. Please try again.');
  }
};

exports.logout = async (req, res) => {
  // Clear the user ID and token cookies on the server-side
  res.clearCookie('userId');
  res.clearCookie('token');

  // Send a JSON response indicating successful logout
  res.json({ message: 'Logout successful' });
};
