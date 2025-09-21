// Import required modules
require('dotenv').config();
const https = require('https');
const fs = require('fs');
const mongoose = require('mongoose');
const app = require('./app'); // Your Express app


// Define the server port
const PORT = process.env.PORT || 5000;

// SSL options
const sslOptions = {
  key: fs.readFileSync('ssl/privatekey.pem'),
  cert: fs.readFileSync('ssl/certificate.pem'),
};

// Connect to MongoDB and start HTTPS server
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected successfully');
  https.createServer(sslOptions, app).listen(PORT, () => {
    console.log(`Secure server running at https://localhost:${PORT}`);
       console.log(
        `CSP mode: ${
          process.env.NODE_ENV !== "production"
            ? "REPORT-ONLY (dev)"
            : "ENFORCED (prod)"
        }`
    );
  });
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});
