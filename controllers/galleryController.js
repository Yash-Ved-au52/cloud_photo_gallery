const path = require('path');
const express = require('express');
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const User = require('../models/user.js');

exports.getdashboard = async (req, res) => {
  const userId = req.cookies.userId;

  if (!userId) 
  {
    // User is not logged in, redirect to login page
    res.redirect('/login');
    return;
  }

  try {
    // Fetch user data based on the userId
    const user = await User.findById(userId);

    if (!user) 
    {
      // User not found, handle the error or redirect to an appropriate page
      res.redirect('/login');
      return;
    }
    
    // Render the dashboard view with the user's data
    res.sendFile(path.join(__dirname, '../public', 'dashboard.html'));

  } catch(error){
    console.error('Error fetching data:', error);
    // Handle the error or redirect to an appropriate page
    res.redirect('/login');
  }
};



exports.uploadPhoto = async (req, res) => {
  try {
    const files = req.files;
    const title = req.body.title;

    // Check if files are present in the request
    if (!files || files.length === 0) 
    {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    // Create an array to store uploaded photo URLs
    const photoUrls = [];

    // Process each uploaded file
    for (const file of files) 
    {
      const result = await cloudinary.uploader.upload(file.path, { folder: 'photo_gallery' });

      // Save the photo URL and title to the user's photos array
      const imageUrl = result.secure_url;

      const user = await User.findOneAndUpdate(
        { _id: req.cookies.userId }, // Find the user by their ID
        { $push: { photos: { imageUrl, title } } }, // Add the new photo to the photos array
        { new: true } // Return the updated user document
      );

      photoUrls.push(imageUrl);
    }
    res.redirect('/dashboard');
    // res.status(201).json({ photos: photoUrls });
  } catch (error){
    console.error('Error uploading photo:', error);
    res.status(500).json({ message: 'Failed to upload photo' });
  }
};


exports.displayPhotos = async (req, res) => {
  try {
    // Retrieve user ID from the cookie
    const userId = req.cookies.userId;

    // Retrieve user photos from the database or any other data source using the user ID
    const user = await User.findById(userId);
    if (!user)
     {
      return res.status(404).json({ error: 'User not found' });
    }

    const photos = user.photos;
    const username = user.name;
    const user_email = user.email;
    // Return the photos as JSON response
    res.json({photos, username, user_email});
  } catch (error) {
    console.error('Error fetching user photos:', error);
    res.status(500).json({ error: 'Failed to fetch user photos' });
  }
};
