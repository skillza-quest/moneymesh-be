const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const investorRoutes = require('./routes/investorRoutes');
const companyRoutes = require('./routes/companyRoutes');
const userRoutes = require('./routes/userRoutes');
const fs = require('fs'); // Add this line for working with file system
const https = require('https');
const app = express();

// Middleware
app.use(express.json());
// Enable CORS only for a specific origin
app.use(cors({
  origin: 'http://localhost:3000'  // Replace with your application's actual address
}));

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

// HTTPS Configuration
const privateKey = fs.readFileSync('path/to/your/private-key.pem', 'utf8'); // Replace with the actual path to your private key file
const certificate = fs.readFileSync('path/to/your/certificate.pem', 'utf8'); // Replace with the actual path to your certificate file

const credentials = { key: privateKey, cert: certificate };

// Create an HTTPS server
const httpsServer = https.createServer(credentials, app);

// Start the HTTPS server
const PORT = 3001;
httpsServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
