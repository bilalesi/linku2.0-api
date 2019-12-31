const { getDepartamentsQueue } = require('./services/queue');

getDepartamentsQueue.add({});

/**
getDepartamentsQueue.add(
  {},
  {
    repeat: {
      cron: '0 6 * 1,2,7,8 *' // every day of JAN,FEB,JUL,AUG at 6:00am
    }
  }
);
*/
