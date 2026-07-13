const mongoose = require('mongoose');
const {mongoURI} = require('./keys');

// Connects to MongoDB and exits the process on failure so we never serve
// requests against a dead database (the old version swallowed the error).
const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

module.exports = connectDB;
