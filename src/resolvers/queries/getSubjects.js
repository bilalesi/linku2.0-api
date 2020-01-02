const { server } = require('../../config');

const getSubjects = async (parent, { search, page }, context) => {
  let query = {};

  if (search && search.length > 0) {
    query = {
      $or: [
        {
          name: {
            $regex: search,
            $options: 'i'
          },
        },
        {
          mat: {
            $regex: search,
            $options: 'i'
          },
        },
      ]
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
