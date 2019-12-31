const { updateDatabaseQueue } = require('./services/queue');

updateDatabaseQueue.add(
  {},
  {
    repeat: {
      cron: '0 6 * 1,2,7,8 *' // every day of JAN,FEB,JUL,AUG at 6:00am
    }
  }
);
