const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  proposalId: {
    type: Schema.Types.ObjectId,
    ref: 'proposalModel',
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'userModel',
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  userEmail: {
    type: String,
    required: true
  },
  userRole: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  offerAmount: {
    type: Number
  },
  counterOfferEquity: {
    type: Number
  },
  isNegotiation: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const commentModel = mongoose.model('commentModel', commentSchema);
module.exports = commentModel;