const getGroups = async (parent, { name, nrc }, context) => {
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

  if (nrc) {
    query = {
      nrc
    };
  }

  return context.models.Group.find(query).populate('subject');
};

module.exports = getGroups;
