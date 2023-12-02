const express = require('express');
const router = express.Router();
const LimitedPartner = require('../models/LimitedPartners');

// Create
router.post('/', async (req, res) => {
    const {
      creatorId, // Not compulsory
      name,
      type,
      hq,
      aum,
      website,
      linkedInProfile,
      avgInvestmentAmount,
      totalInvestmentsMade,
      eligibleGpFundSize,
      gpTrackRecord,
      fundStrategy,
      investmentStage,
      investedFunds,
      industryFocus,
      geographicFocus,
      fundSize,
      exitHistory,
      primaryContactName,
      primaryContactPosition,
      contactEmail,
      contactPhone,
      rating,
      reviews,
      tags,
      timeToDecision,
      notes,
      status,
      createdAt = Date.now()
    } = req.body;
  
    try {
      const newLimitedPartner = new LimitedPartner({
        creatorId,
        name,
        type,
        hq,
        aum,
        website,
        linkedInProfile,
        avgInvestmentAmount,
        totalInvestmentsMade,
        eligibleGpFundSize,
        gpTrackRecord,
        fundStrategy,
        investmentStage,
        investedFunds,
        industryFocus,
        geographicFocus,
        fundSize,
        exitHistory,
        primaryContactName,
        primaryContactPosition,
        contactEmail,
        contactPhone,
        rating,
        reviews,
        tags,
        timeToDecision,
        notes,
        status,
        createdAt
      });
  
      const savedLimitedPartner = await newLimitedPartner.save();
      res.status(201).json(savedLimitedPartner);
    } catch (error) {
      console.error('Could not save the limited partner:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  

// Read All
router.get('/', async (req, res) => {
  try {
    const limitedPartners = await LimitedPartner.find();
    res.json(limitedPartners);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.get('/industries', async (req, res) => {
  try {
    const limitedPartners = await LimitedPartner.find({}, 'industryFocus'); 
    const allIndustries = limitedPartners.flatMap(limitedPartner => limitedPartner.industryFocus); // Flatten the arrays

    const uniqueIndustries = [...new Set(allIndustries
      .filter(industry => typeof industry === 'string') // Ensure it's a string
      .map(industry => industry.trim())
    )];

    console.log(uniqueIndustries);
    res.json(uniqueIndustries);
  } catch (err) {
    console.error("Error fetching industries:", err);
    res.status(500).json({ message: err.message });
  }
});


// Read One
router.get('/:id', getLimitedPartner, (req, res) => {
  res.json(res.limitedPartner);
});

// Update One
router.patch('/:id', getLimitedPartner, async (req, res) => {
  Object.assign(res.limitedPartner, req.body);
  res.limitedPartner.lastUpdated = new Date();
  
  try {
    const updatedLimitedPartner = await res.limitedPartner.save();
    res.json(updatedLimitedPartner);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete One
router.delete('/:id', getLimitedPartner, async (req, res) => {
  try {
    await res.limitedPartner.remove();
    res.json({ message: 'Deleted LP' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getLimitedPartner(req, res, next) {
  let limitedPartner;
  try {
    limitedPartner = await LimitedPartner.findById(req.params.id);
    if (limitedPartner == null) {
      return res.status(404).json({ message: 'Cannot find LP' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.limitedPartner = limitedPartner;
  next();
}



module.exports = router;
