const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const proposalModel = require("../models/proposalModel");
const commentModel = require("../models/commentModel");
const userModel = require("../models/userModel");

// Create new proposal
router.post("/create", async (req, res) => {
  try {
    const {
      title,
      startupId,
      founderEmail,
      founderName,
      description,
      fundingGoal,
      equity,
      businessPlan,
      financialProjections,
      industry,
      timeline
    } = req.body;

    const newProposal = await proposalModel.create({
      title,
      startupId,
      founderEmail,
      founderName,
      description,
      fundingGoal,
      equity,
      businessPlan,
      financialProjections,
      industry,
      timeline,
      status: 'Under Review'
    });

    return res.status(200).json({
      message: "Proposal created successfully",
      proposal: newProposal,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// Get all proposals (with filtering options)
router.get("/fetchAll", async (req, res) => {
  try {
    const { status, industry, founderEmail } = req.query;
    
    let query = {};
    
    if (status) query.status = status;
    if (industry) query.industry = industry;
    if (founderEmail) query.founderEmail = founderEmail;
    
    const proposals = await proposalModel.find(query).sort({ createdAt: -1 });
    
    return res.status(200).json({
      proposals: proposals,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// Get proposal by ID
router.get("/:id", async (req, res) => {
  try {
    const proposalId = req.params.id;
    const proposal = await proposalModel.findById(proposalId);
    
    if (!proposal) {
      return res.status(404).json({
        message: "Proposal not found",
      });
    }
    
    return res.status(200).json({
      proposal: proposal,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// Update proposal status
router.put("/updateStatus/:id", async (req, res) => {
  try {
    const { status } = req.body;
    const proposalId = req.params.id;
    
    const proposal = await proposalModel.findByIdAndUpdate(
      proposalId,
      { 
        status: status,
        updatedAt: Date.now()
      },
      { new: true }
    );
    
    if (!proposal) {
      return res.status(404).json({
        message: "Proposal not found",
      });
    }
    
    return res.status(200).json({
      message: "Status updated successfully",
      proposal: proposal,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// Add comment to proposal
router.post("/comment", async (req, res) => {
  try {
    const {
      proposalId,
      userId,
      userName,
      userEmail,
      userRole,
      content,
      offerAmount,
      counterOfferEquity,
      isNegotiation
    } = req.body;

    const newComment = await commentModel.create({
      proposalId,
      userId,
      userName,
      userEmail,
      userRole,
      content,
      offerAmount,
      counterOfferEquity,
      isNegotiation
    });

    // If this is a negotiation, update the proposal status
    if (isNegotiation) {
      await proposalModel.findByIdAndUpdate(
        proposalId,
        { 
          status: 'Negotiating',
          updatedAt: Date.now()
        }
      );
    }

    return res.status(200).json({
      message: "Comment added successfully",
      comment: newComment,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// Get comments for a proposal
router.get("/comments/:proposalId", async (req, res) => {
  try {
    const proposalId = req.params.proposalId;
    
    const comments = await commentModel.find({ proposalId: proposalId })
      .sort({ createdAt: 1 });
    
    return res.status(200).json({
      comments: comments,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

// Mark proposal as funded
router.put("/fund/:id", async (req, res) => {
  try {
    const proposalId = req.params.id;
    
    const proposal = await proposalModel.findByIdAndUpdate(
      proposalId,
      { 
        status: 'Funded',
        updatedAt: Date.now()
      },
      { new: true }
    );
    
    if (!proposal) {
      return res.status(404).json({
        message: "Proposal not found",
      });
    }
    
    return res.status(200).json({
      message: "Proposal marked as funded successfully",
      proposal: proposal,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
});

module.exports = router;