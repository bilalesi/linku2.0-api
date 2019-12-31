const Queue = require('bull');
const { redis } = require('../config');
const { setQueues } = require('bull-board');
const { Group, Subject } = require('../models');

const { getAllDepartments, getGroupsByDepartment } = require('./scraper');

const getGroupQueue = new Queue('groups', redis.url);
const getDepartmentGroupsQueue = new Queue('get departments groups', redis.url);
const getDepartamentsQueue = new Queue('get departments', redis.url);

// Clean all the jobs in both queues
for (const status of ['active', 'completed', 'delayed', 'failed', 'wait']) {
  getGroupQueue.clean(1000, status);
  getDepartmentGroupsQueue.clean(1000, status);
  getDepartamentsQueue.clean(1000, status);
}

/**
 * Get information of the groups of a department
 */
getDepartmentGroupsQueue.process(async job => {
  const { code } = job.data;
  const groups = await getGroupsByDepartment(code);

  job.progress(50);

  await Promise.all(
    groups.map(async group => {
      const { code, number } = group.subject;
      const subject = await Subject.findOneAndUpdate(
        {
          code,
          number
        },
        group.subject,
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true
        }
      );

      Object.assign(group, {
        subject
      });

      await Group.findOneAndUpdate(
        {
          nrc: group.nrc
        },
        group,
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true
        }
      );
    })
  );

  job.progress(100);
});

/**
 * Create jobs for every department.
 */
getDepartamentsQueue.process(2, async job => {
  const departments = await getAllDepartments();

  departments.map((department, i) => {
    getDepartmentGroupsQueue.add(department);
    job.progress(((i + 1) / departments.length) * 100);
  });
});

setQueues([getGroupQueue, getDepartmentGroupsQueue, getDepartamentsQueue]);

module.exports = {
  getGroupQueue,
  getDepartmentGroupsQueue,
  getDepartamentsQueue
};
