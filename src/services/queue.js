const Queue = require('bull');
const { redis } = require('../config');

const updateDatabaseQueue = new Queue('update database queue', redis.url);

const { DEPARTMENTS, getGroupsByDepartment } = require('../services/scraper');
const { Group } = require('../models')

/**
 * Update database 
 */
updateDatabaseQueue.process(async job => {
  await Promise.all(DEPARTMENTS.map(({ id }) => {
    const groups = await getGroupsByDepartment(id)

    // TODO verify if the group is already in the database... in that case, update the information
    return groups.map(group => Group.create(group))
  }));
});

module.exports = {
  updateDatabaseQueue
};
