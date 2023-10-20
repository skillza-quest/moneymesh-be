const express = require('express');
const router = express.Router();
const Mandate = require('../models/Mandates');

// Create a new Mandate
router.post('/create', async (req, res) => {
    const newMandate = new Mandate(req.body);
    try {
      await newMandate.save();
      res.status(201).json(newMandate);
    } catch (err) {
      console.error("Error details:", err);
      res.status(400).json({ message: err.message });
    }
  });

// Add an event to a Mandate
router.post('/:mandateId/addEvent/:investorId', async (req, res) => {
    try {
      const mandate = await Mandate.findById(req.params.mandateId);
      const investor = mandate.investors.find(inv => inv.investorId.toString() === req.params.investorId);
      if (investor) {
        investor.events.push(req.body);
        await mandate.save();
        res.status(200).json(mandate);
      } else {
        res.status(404).json({ message: 'Investor not found in mandate' });
      }
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });

// Add an investor to a Mandate
router.post('/:id/addInvestor', async (req, res) => {
    try {
      const mandate = await Mandate.findById(req.params.id);
      const newInvestor = {
        investorId: req.body.investorId,
        mandateStatus: 'new',  // default status
        events: [],
        notes: ''
      };
      mandate.investors.push(newInvestor);
      await mandate.save();
      res.status(200).json(mandate);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  });
  

// Add a collaborator to a Mandate
router.post('/:id/addCollaborator', async (req, res) => {
  try {
    const mandate = await Mandate.findById(req.params.id);
    mandate.collaboratorIds.push(req.body.collaboratorId);
    await mandate.save();
    res.status(200).json(mandate);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a Mandate
router.delete('/:id', async (req, res) => {
  try {
    await Mandate.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Mandate deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
