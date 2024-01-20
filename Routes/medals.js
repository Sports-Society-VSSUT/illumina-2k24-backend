const express = require('express');
const router = express.Router();
const { ObjectId } = require('mongodb');
const Medal = require('../model/medalModel.js');

router.post('/medal_input', async (req, res) => {
  try {
    const existingMedal = await Medal.findOne({ groupName: req.body.groupName });

    if (existingMedal) {
      // If a record with the same groupName exists, update it
      existingMedal.goldCount = req.body.goldCount;
      existingMedal.silverCount = req.body.silverCount;
      existingMedal.bronzeCount = req.body.bronzeCount;

      await existingMedal.save();
      res.status(200).json({ message: 'Medal data updated successfully' });
    } else {
      const newMedal = new Medal({
        groupName: req.body.groupName,
        goldCount: req.body.goldCount,
        silverCount: req.body.silverCount,
        bronzeCount: req.body.bronzeCount,
      });

      await newMedal.save();
      res.status(201).json({ message: 'Medal data saved successfully' });
    }
  } catch (error) {
    console.error('Error saving/updating medal data', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
