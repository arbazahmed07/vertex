const express = require("express");
const router = express.Router();

const investorModel = require("../models/investorModel");

router.get("/fetchAll", async (req, res) => {
  var investor = await investorModel.find();
  console.log("investor", investor);
  return res.status(200).json({
    investor: investor,
  });
});

router.get("/:id", async (req, res) => {
  id = req.params.id;
  const result = await investorModel.find({ email: id });
  if (!result) {
    return res.status(404).json({
      feedbacks: "Not Found",
    });
  } else {
    return res.status(200).json({
      investor: result[0],
    });
  }
});

// Add a new route to create an investor
router.post("/add", async (req, res) => {
  try {
    const { name, email, photo, field, contactNo, totalInvestment } = req.body;
    
    // Check if investor with same email already exists
    const existingInvestor = await investorModel.findOne({ email });
    if (existingInvestor) {
      return res.status(400).json({
        message: "Investor with this email already exists",
      });
    }
    
    // Create new investor
    const newInvestor = await investorModel.create({
      name,
      email,
      photo,
      field,
      contactNo,
      totalInvestment,
    });
    
    return res.status(200).json({
      message: "Investor created successfully",
      investor: newInvestor,
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
