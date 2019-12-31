const { ApolloError } = require('apollo-server');
const { getDepartamentsQueue } = require('../../services/queue');

const updateDatabase = async (parent, args, context) => {
  const cron = await context.models.Cron.findOne();

  if (cron && Date.now() - cron.lastCall.getTime() < 24 * 60 * 60 * 1000) {
    throw new ApolloError('Can be executed after 1 day', 400);
  }

  getDepartamentsQueue.add({});

  await context.models.Cron.findOneAndUpdate({}, {
    lastCall: new Date(),
  }, {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true
  });

  return true;
};

module.exports = updateDatabase;
