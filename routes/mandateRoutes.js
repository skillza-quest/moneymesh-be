const express = require('express');
const router = express.Router();
const Mandate = require('../models/Mandates');
const Investor = require('../models/Investors');
const InviteToken = require('../models/InviteTokens'); 
const crypto = require('crypto');

const inviteTokens = {};


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
router.get('/:mandateId', async (req, res) => {
    const { mandateId } = req.params;
    const userId = req.query.userId;  
    console.log("userID", userId);
    try {
      const mandate = await Mandate.findById(mandateId)
        .populate('investors.investorId', 'name')
        .populate('collaboratorIds', 'name');

      if (!mandate) {
        return res.status(404).json({ message: 'Mandate not found' });
      }

      // Check if the user is either an investor or a collaborator
      if (mandate.creatorId === userId || mandate.collaboratorIds.some(collaboratorId => collaboratorId.toString() === userId)) {
        res.status(200).json(mandate);
      } else {
        return res.status(403).json({ message: 'Access denied' });
      }
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
router.delete('/:mandateId', async (req, res) => {
  try {
    await Mandate.findByIdAndDelete(req.params.mandateId);
    res.status(200).json({ message: 'Mandate deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/user/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      const userMandates = await Mandate.find({
        $or: [
          { creatorId: userId },
          { collaboratorIds: userId }
        ]
      });
      res.status(200).json(userMandates);
    } catch (err) {
      console.error("Error details:", err);
      res.status(400).json({ message: err.message });
    }
  });
  

  router.get('/:mandateId/investor/:investorId', async (req, res) => {
    const { mandateId, investorId } = req.params;
  
    try {
      const mandate = await Mandate.findById(mandateId);
  
      if (!mandate) {
        return res.status(404).json({ message: 'Mandate not found' });
      }
  
      const investorInMandate = mandate.investors.find(investor => investor.investorId.toString() === investorId);
  
      if (!investorInMandate) {
        return res.status(404).json({ message: 'Investor not found within this mandate' });
      }
  
      const fullInvestorDetails = await Investor.findById(investorId);
  
      if (!fullInvestorDetails) {
        return res.status(404).json({ message: 'Investor details could not be found' });
      }
  
      res.status(200).json({ investorDetails: fullInvestorDetails, investorInMandate });
  
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });

  router.patch('/:mandateId/investors/:investorId/notes', async (req, res) => {
    try {
      const { mandateId, investorId } = req.params;
      const { notes } = req.body;
  
      const mandate = await Mandate.findById(mandateId);
      const investorInMandate = mandate.investors.find(inv => inv.investorId.toString() === investorId);
  
      if (!investorInMandate) {
        return res.status(404).json({ message: 'Investor not found in the mandate' });
      }
  
      const newEvent = {
        timestamp: new Date(),
        eventType: 'Notes',
        notes,
        status: investorInMandate.mandateStatus,  // Or whatever status you'd like to use for notes
      };
  
      investorInMandate.events.push(newEvent);
      await mandate.save();
  
      res.status(200).json({ message: 'Notes added successfully as an event' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  router.get('/:mandateId/investors/:investorId/notes', async (req, res) => {
    try {
      const { mandateId, investorId } = req.params;
      
      // Find the mandate by ID
      const mandate = await Mandate.findById(mandateId);
  
      // Validate if mandate exists
      if (!mandate) {
        return res.status(404).json({ message: 'Mandate not found' });
      }
  
      // Find the specific investor within the mandate
      const investorInMandate = mandate.investors.find(inv => inv.investorId.toString() === investorId);
  
      // Validate if investor exists within the mandate
      if (!investorInMandate) {
        return res.status(404).json({ message: 'Investor not found within this mandate' });
      }
  
      // Extract the notes from the events
      const notes = investorInMandate.events.filter(event => event.eventType === 'Notes').map(event => event.notes);
  
      // Return the notes
      res.status(200).json(notes);
      
    } catch (error) {
      console.error('Error fetching notes:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  router.patch('/:mandateId/investors/:investorId/status', async (req, res) => {
    const { mandateId, investorId } = req.params;
    const { status } = req.body;
  
    try {
      const mandate = await Mandate.findById(mandateId);
      const investorInMandate = mandate.investors.find(
        (investor) => investor.investorId.toString() === investorId
      );
  
      if (!investorInMandate) {
        return res.status(404).json({ message: 'Investor not found in this mandate' });
      }
  
      investorInMandate.mandateStatus = status;
  
      await mandate.save();
  
      res.status(200).json({ message: 'Status updated', status });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
    
// Generate invite link
  router.post('/generate-invite/:mandateId', async (req, res) => {
    const { mandateId } = req.params;
    const token = crypto.randomBytes(16).toString('hex');
    const inviteToken = new InviteToken({
        token,
        mandateId,
        expires: new Date(Date.now() + 60000 * 60 * 24),
        consumed: false
      });
      console.log(inviteToken);
      await inviteToken.save();
      res.json({ token });
  });
  
  // Accept invite
  router.post('/accept-invite/:token', async (req, res) => {
    const { token } = req.params;
    const { userId } = req.body;    
    console.log("TOKEN", token);
    const invite = await InviteToken.findOne({ token });
    if (!invite || invite.expires < Date.now() || invite.consumed) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }
    console.log("invite", invite);

    try {
      const mandate = await Mandate.findById(invite.mandateId);
      if (!mandate) {
        return res.status(404).json({ error: 'Mandate not found' });
      }
      console.log("mandate", mandate);
      mandate.collaboratorIds.push(userId);
      await mandate.save();
      invite.consumed = true;  
      await invite.save();  // Corrected line
      res.status(200).json({ success: true });
    } catch (error) {
        console.error('Error:', error);
      res.status(500).json({ error: 'Could not add collaborator' });
    }
});

router.get('/:mandateId/invite-token', async (req, res) => {
    try {
        const { mandateId } = req.params;
        const inviteToken = await InviteToken.findOne({ mandateId });
        if (inviteToken) {
            res.json({ tokenExists: true, token: inviteToken.token, tokenExpired: inviteToken.expires < Date.now() });
        } else {
            res.json({ tokenExists: false });
        }
    } catch (error) {
        res.status(500).json({ error: 'Could not fetch invite token information' });
    }
});


module.exports = router;
