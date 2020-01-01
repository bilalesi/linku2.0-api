const { server } = require('../../config');

const getSubjects = async (parent, { search, page }, context) => {
  let query = {};

  if (name) {
    query = {
      name: {
        $regex: search,
        $options: 'i'
      },
    };
  }

  const {
    docs,
    totalPages,
    limit,
    nextPage,
    prevPage,
  } = await context.models.Subject.paginate(query, {
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

module.exports = getSubjects;
