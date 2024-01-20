const mongoose = require('mongoose');

const medalSchema = new mongoose.Schema({
  groupName: String,
  goldCount: Number,
  silverCount: Number,
  bronzeCount: Number,
});

const Medal = mongoose.model('Medal', medalSchema);

module.exports = Medal;
