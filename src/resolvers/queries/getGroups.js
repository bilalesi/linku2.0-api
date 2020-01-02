const { server } = require('../../config');

const getGroups = async (parent, { name, page }, context) => {
  let query = {};

  if (name && name.length > 0) {
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

module.exports = getGroups;
