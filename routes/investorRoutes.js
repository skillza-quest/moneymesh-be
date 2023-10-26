const express = require('express');
const router = express.Router();
const Investor = require('../models/Investors');
const multer = require('multer');
const XLSX = require('xlsx');

const upload = multer({ dest: 'uploads/' });

// Bulk Upload route
router.post('/bulk-upload', upload.single('file'), async (req, res) => {
  try {
    const workbook = XLSX.readFile(req.file.path);
    const sheet_name_list = workbook.SheetNames;
    const data = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
    let skippedRows = 0;
    console.log("First row from Excel:", data[0]);

    for (const row of data) {
      if (row['Name'] && row['Type']) {
        const newInvestor = new Investor({
          name: row['Name'],
          type: row['Type'],
          website: row['Website'],
          linkedInProfile: row['LinkedInProfile'],
          avgInvestmentAmount: row['AvgInvestmentAmount'],
          totalInvestmentsMade: row['TotalInvestmentsMade'],
          investedCompanies: row['InvestedCompanies'] ? row['InvestedCompanies'].split(',') : [],
          investmentStage: row['InvestmentStage'],
          industryFocus: row['IndustryFocus'] ? row['IndustryFocus'].split(',') : [],
          geographicFocus: row['GeographicFocus'],
          fundSize: row['FundSize'],
          exitHistory: row['ExitHistory'] ? row['ExitHistory'].split(',') : [],
          primaryContactName: row['PrimaryContactName'],
          primaryContactPosition: row['PrimaryContactPosition'],
          contactEmail: row['ContactEmail'],
          contactPhone: row['ContactPhone'],
          rating: row['Rating'],
          reviews: row['Reviews'] ? row['Reviews'].split(',') : [],
          tags: row['Tags'] ? row['Tags'].split(',') : [],
          timeToDecision: row['TimeToDecision'],
          dueDiligenceRequirements: row['DueDiligenceRequirements'] ? row['DueDiligenceRequirements'].split(',') : [],
          notes: row['Notes'],
          status: row['Status']
        });
        if (skippedRows === 0) {
          console.log("First newInvestor object:", newInvestor);
        }
        await newInvestor.save();
      } else {
        skippedRows++;
      }
    }
    res.status(201).send(`Data successfully uploaded. Skipped ${skippedRows} rows due to missing name or type.`);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create
router.post('/', async (req, res) => {
  const {
    name,
    type,
    website,
    linkedInProfile,
    avgInvestmentAmount,
    totalInvestmentsMade,
    investedCompanies,
    investmentStage,
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
    creatorId  // Not compulsory
  } = req.body;

  try {
    const newInvestor = new Investor({
      name,
      type,
      website,
      linkedInProfile,
      avgInvestmentAmount,
      totalInvestmentsMade,
      investedCompanies,
      investmentStage,
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
      creatorId
    });

    const savedInvestor = await newInvestor.save();
    res.status(201).json(savedInvestor);
  } catch (error) {
    console.error('Could not save the investor:', error);
    res.status(500).json({ message: 'Internal Server Error' });
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

router.get('/industries', async (req, res) => {
  try {
    const uniqueIndustries = await Investor.distinct('industryFocus'); 
    console.log(uniqueIndustries);
    res.json(uniqueIndustries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
