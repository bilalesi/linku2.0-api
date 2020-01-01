const getGroup = async (parent, { nrc }, context) => {
  const group = await context.models.Group.findOne({
    nrc,
  }).populate('subject');

  return group;
};

module.exports = getGroup;
