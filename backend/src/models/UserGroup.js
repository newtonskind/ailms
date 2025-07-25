const mongoose = require('mongoose');

const userGroupSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String }
});

module.exports = mongoose.model('UserGroup', userGroupSchema); 