const {
  DEPARTMENTS,
  getGroupsByDepartment
} = require('../../services/scraper');

const updateDatabase = async (parent, args, context) => {
  await Promise.all(
    DEPARTMENTS.map(async ({ id }) => {
      const groups = await getGroupsByDepartment(id);
      return groups.map(group => context.models.Group.create(group));
    })
  );

  return true;
};

module.exports = updateDatabase;
