const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const User = require('./models/user.js');
require('dotenv').config();

const app = express();

// Define storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    
    cb(null, 'uploads/');                      // destination folder where files will be saved
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});
// Create multer instance
const upload = multer({ storage: storage });

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB Atlas', err);
  });
const db = mongoose.connection;



// Route: Sign Up
const authController = require('./controllers/authController');
// app.get('/signUp', authController.getSignUpPage);
app.post('/signUp', authController.signUp);

// Route: Login
app.get('/login', authController.getLoginPage);
app.post('/login', authController.login);

// Route: Logout
app.get('/logout',authController.logout);

const galleryController = require('./controllers/galleryController');

app.get('/dashboard', galleryController.getdashboard);
app.post('/upload',upload.array('photos'), galleryController.uploadPhoto);
app.get('/api/photos', galleryController.displayPhotos); 

// Start the server
app.listen(8000, () => {
  console.log('Server started successfully');
});
