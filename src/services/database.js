const mongoose = require('mongoose');
const config = require('../config');

const { database } = config;

/**
 * Connect to database
 */
function connect() {
  mongoose.connect(
    database.url,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    },
    err => {
      if (err) {
        console.log('Database connection error:', err);
      }
    }
  );

  mongoose.connection.on('open', () => {
    console.log(`Database => ${database.url} \x1b[32m%s\x1b[0m`, 'connected');
  });
}

/**
 * Disconnect from the database
 */
function disconnect() {
  mongoose.connection.close();
}

module.exports = {
  connect,
  disconnect
};
