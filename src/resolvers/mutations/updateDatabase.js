const { updateDatabaseQueue } = require('../../services/queue');

const updateDatabase = async (parent, args, context) => {
  updateDatabaseQueue();
  return true;
};

module.exports = updateDatabase;
