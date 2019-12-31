const { getDepartamentsQueue } = require('./services/queue');

/**
 * If the API is deployed on production mode, add the CRON job
 */
if (process.env.NODE_ENV === 'production') {
  getDepartamentsQueue.add(
    {},
    {
      repeat: {
        cron: '0 6 * 1,2,7,8 *' // every day of JAN,FEB,JUL,AUG at 6:00am
      }
    }
  );
}
