const mongoose = require('mongoose');
const { server } = require('../../config');

const getSubjectsGroups = async (parent, { subjectsIds, page }, context) => {
  const query = {
    subject: {
      $in: subjectsIds.map((id) => mongoose.Types.ObjectId(id))
    },
  };

  const {
    docs,
    totalPages,
    limit,
    nextPage,
    prevPage,
  } = await context.models.Group.paginate(query, {
    limit: server.pagination.limit,
    page: page || server.pagination.defaultPage,
    populate: 'subject'
  });

  return {
    docs,
    pageInfo: {
      totalPages,
      limit,
      nextPage,
      prevPage,
    }
  }
};

module.exports = getSubjectsGroups;
