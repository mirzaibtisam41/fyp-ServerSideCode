require('dotenv').config();

const app = require('./app');
const {port} = require('./config/keys');
const connectDB = require('./config/db');

// Connect to the database, then start listening.
connectDB().then(() => {
  app.listen(port, () => console.log(`Server running on port ${port}`));
});

module.exports = app;
