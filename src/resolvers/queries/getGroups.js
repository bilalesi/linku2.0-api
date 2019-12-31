const getGroups = async (parent, { name, nrc }, context) => {
  if (name) {
    const subject = await context.models.Subject.find({
      $text: { $search: name }
    })
  
    const groups = await context.models.Group.find({
      subject,
    }).populate('subject');
  
    return groups;
  }

  if (nrc) {
    const groups = await context.models.Group.find({
      nrc,
    }).populate('subject');

    return groups;
  }

  return context.models.Group.find();
};

module.exports = getGroups;
