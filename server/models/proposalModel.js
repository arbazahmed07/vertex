const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const proposalSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  startupId: {
    type: Schema.Types.ObjectId,
    ref: 'startups',
    required: true
  },
  founderEmail: {
    type: String, 
    required: true
  },
  founderName: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  fundingGoal: {
    type: Number,
    required: true
  },
  equity: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  businessPlan: {
    type: String, // URL to business plan document
  },
  financialProjections: {
    type: String, // URL to financial projections
  },
  industry: {
    type: String,
    required: true
  },
  timeline: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Draft', 'Under Review', 'Negotiating', 'Funded', 'Rejected'],
    default: 'Under Review'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

const proposalModel = mongoose.model('proposalModel', proposalSchema);
module.exports = proposalModel;