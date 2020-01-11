const Queue = require('bull');
const { redis } = require('../config');
const { setQueues } = require('bull-board');
const { Group, Subject } = require('../models');

const { getAllDepartments, getGroupsByDepartment } = require('./scraper');

const getGroupQueue = new Queue('groups', redis.url);
const getDepartmentGroupsQueue = new Queue('get departments groups', redis.url);
const getDepartamentsQueue = new Queue('get departments', redis.url);

const initQueues = () => {
  for (const status of ['active', 'completed', 'delayed', 'failed', 'wait']) {
    getGroupQueue.clean(100, status);
    getDepartmentGroupsQueue.clean(100, status);
    getDepartamentsQueue.clean(100, status);
  }
  getDepartamentsQueue.add({});
}

/**
 * Get and update information of a group.
 */
getGroupQueue.process(async job => {
  /** @type {import('../types').Group} */
  const group = job.data;

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

  job.progress(50);

  await Group.findOneAndUpdate(
    {
      nrc: group.nrc
    },
    {
      ...group,
      subject
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    }
  );

  job.progress(100);
});

/**
 * Get information of the groups of a department
 */
getDepartmentGroupsQueue.process(async job => {
  const { code } = job.data;
  const groups = await getGroupsByDepartment(code);

  groups.map((group, i) => {
    getGroupQueue.add(group, {
      attempts: 5
    });
    job.progress(((i + 1) / groups.length) * 100);
  });
});

getDepartmentGroupsQueue.on('global:completed', async () => {
  await Cron.findOneAndUpdate(
    {},
    {
      lastCall: new Date()
    },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    }
  );
});

/**
 * Create jobs for every department.
 */
getDepartamentsQueue.process(2, async job => {
  const departments = await getAllDepartments();

  departments.map((department, i) => {
    getDepartmentGroupsQueue.add(department, {
      attempts: 5
    });
    job.progress(((i + 1) / departments.length) * 100);
  });
});

setQueues([getGroupQueue, getDepartmentGroupsQueue, getDepartamentsQueue]);

module.exports = {
  getGroupQueue,
  getDepartmentGroupsQueue,
  getDepartamentsQueue,
  initQueues,
};
