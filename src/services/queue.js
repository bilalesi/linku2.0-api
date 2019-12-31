const Queue = require('bull');
const { redis } = require('../config');
const { setQueues } = require('bull-board');

const { getAllDepartments, getGroupsByDepartment } = require('./scraper');

const updateDepartmentGroupsQueue = new Queue(
  'update departments groups',
  redis.url
);
const getDepartamentsQueue = new Queue('get departments', redis.url);

for (const status of ['active', 'completed', 'delayed', 'failed', 'wait']) {
  updateDepartmentGroupsQueue.clean(1000, status);
  getDepartamentsQueue.clean(1000, status);
}

/**
 * Get information of the groups of a department
 */
updateDepartmentGroupsQueue.process(async job => {
  const { name, code } = job.data;

  const groups = await getGroupsByDepartment(code);

  job.progress(100);
});

/**
 * Create jobs for every department.
 */
getDepartamentsQueue.process(2, async job => {
  const departments = await getAllDepartments();

  departments.map((department, i) => {
    updateDepartmentGroupsQueue.add(department);
    job.progress(((i + 1) / departments.length) * 100);
  });
});

setQueues([getDepartamentsQueue, updateDepartmentGroupsQueue]);

module.exports = {
  getDepartamentsQueue,
  updateDepartmentGroupsQueue
};
