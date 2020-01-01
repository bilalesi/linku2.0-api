const { server } = require('../../config');

const getGroups = async (parent, { name, page }, context) => {
  let query = {};

  if (name) {
    const subject = await context.models.Subject.find({
      name: {
        $regex: name,
        $options: 'i'
      }
    });

    query = {
      subject
    };
  }

  const {
    docs,
    totalPages,
    limit,
    nextPage,
    prevPage,
  } = await context.models.Group.find(query)
    .populate('subject')
    .paginate({
      limit: server.pagination.limit,
      page: page || server.pagination.defaultPage
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

module.exports = getGroups;
