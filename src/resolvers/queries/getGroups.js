const getGroups = async (parent, args, context) => {
  const groups = context.models.Group.find();

  return groups;
};

module.exports = getGroups;
