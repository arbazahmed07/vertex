
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: false
  },
  role: {
    type: String,
    enum: ['startup', 'investor', 'admin'],
    default: 'startup',  // Set a default role
    required: true
  }
});

const userModel = mongoose.model('userModel', userSchema);
module.exports = userModel;