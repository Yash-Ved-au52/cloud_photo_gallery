const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const User = require('./models/user.js');

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
  cloud_name: 'drnk3cgr0',
  api_key: '488214663466711',
  api_secret: 'slATiN97gz0wnJupKFeqNTvKtMY',
});

// Connect to MongoDB
mongoose
  .connect('mongodb+srv://yashved01:NtHUyReL5Gj9qRrj@yash01.95jixfo.mongodb.net/test', {
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
app.get('/signUp', authController.getSignUpPage);
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
