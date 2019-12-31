const getGroups = async (parent, args, context) => {
  const groups = context.models.Group.find({}).populate('Subject');

  return groups;
};

module.exports = getGroups;
