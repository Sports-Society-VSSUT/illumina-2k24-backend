const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const Medal = require('../model/medalModel.js'); // Import your Medal model

// Route to get all medal data
router.get('/medal_data', async (req, res) => {
  try {
    const medals = await Medal.find();
    res.status(200).json(medals);
  } catch (error) {
    console.error('Error fetching medal data', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
