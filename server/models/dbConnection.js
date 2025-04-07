const mongoose = require('mongoose');
const db_link = 'mongodb+srv://mdarbazking7:Mdarbaz123@cluster0.hlmjter.mongodb.net/invst';

// Improved MongoDB connection with better error handling and options
mongoose.connect(db_link, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 15000, // Timeout after 15 seconds instead of default 30
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
})
.then(() => {
  console.log('Successfully connected to MongoDB');
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Export the mongoose connection
module.exports = mongoose.connection;
