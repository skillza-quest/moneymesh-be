const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const defaultRoutes = require('./routes/defaultRoutes');

const investorRoutes = require('./routes/investorRoutes');
const companyRoutes = require('./routes/companyRoutes');
const userRoutes = require('./routes/userRoutes');
const https = require('https');
const app = express();

// Middleware
app.use(express.json());
// Enable CORS only for a specific origin
app.use(cors());

// MongoDB Atlas connection
const mongoURI = 'mongodb+srv://anandsatyan:Krissna1.@moneymash.yacpjgs.mongodb.net/';
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Routes
app.use('/', defaultRoutes);
app.use('/investors', investorRoutes);
app.use('/users', userRoutes);
app.use('/companies', companyRoutes);

// Start the Server
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
