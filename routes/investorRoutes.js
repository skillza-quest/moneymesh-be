const express = require('express');
const router = express.Router();
const Investor = require('../models/Investors');
const multer = require('multer');
const XLSX = require('xlsx');

const upload = multer({ dest: 'uploads/' });

// Bulk Upload
router.post('/upload', upload.single('file'), (req, res) => {
    const workbook = XLSX.readFile(req.file.path);
    const sheet_name_list = workbook.SheetNames;
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    
    data.forEach(async (row) => {
      const newInvestor = new Investor({
        investorId: row.InvestorID,
        name: row.Name,
        type: row.Type,
        // ... other fields
      });
      
      try {
        await newInvestor.save();
      } catch (err) {
        console.log(`Failed to insert ${row.InvestorID}: ${err}`);
      }
    });
    res.status(201).send('Data successfully uploaded');
  });

// Create
router.post('/', async (req, res) => {
  const newInvestor = new Investor(req.body);
  try {
    await newInvestor.save();
    res.status(201).json(newInvestor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Read All
router.get('/', async (req, res) => {
  try {
    const investors = await Investor.find();
    res.json(investors);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Read One
router.get('/:id', getInvestor, (req, res) => {
  res.json(res.investor);
});

// Update One
router.patch('/:id', getInvestor, async (req, res) => {
  Object.assign(res.investor, req.body);
  res.investor.lastUpdated = new Date();
  
  try {
    const updatedInvestor = await res.investor.save();
    res.json(updatedInvestor);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete One
router.delete('/:id', getInvestor, async (req, res) => {
  try {
    await res.investor.remove();
    res.json({ message: 'Deleted Investor' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

async function getInvestor(req, res, next) {
  let investor;
  try {
    investor = await Investor.findById(req.params.id);
    if (investor == null) {
      return res.status(404).json({ message: 'Cannot find investor' });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.investor = investor;
  next();
}

module.exports = router;
