const Queue = require('bull');
const { redis } = require('../config');
const { getAllDepartments, getGroupsByDepartment } = require('./scraper');

const updateDepartmentGroupsQueue = new Queue(
  'update departments groups',
  redis.url
);
const getDepartamentsQueue = new Queue('get departments', redis.url);

/**
 *
 */
updateDepartmentGroupsQueue.process(async job => {
  try {
    const { name, code } = job.data;
    const groups = await getGroupsByDepartment(code);

    for (const group of groups) {
    }
  } catch (e) {
    console.error(e);
  }
});

/**
 * Create jobs for every department.
 */
getDepartamentsQueue.process(2, async job => {
  try {
    const departments = await getAllDepartments();
    for (const department of departments) {
      updateDepartmentGroupsQueue.add(department);
    }
  } catch (e) {
    console.error(e);
  }
});

module.exports = {
  getDepartamentsQueue,
  updateDepartmentGroupsQueue
};
