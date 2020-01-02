const { ObjectId } = require('mongoose').Types;

const getSubjectGroups = async (parent, { subjectId }, context) => {
  const subject = new ObjectId(subjectId);
  const groups = await context.models.Group.find({
    subject,
  }).populate('subject');

  return groups;
};

module.exports = getSubjectGroups;
