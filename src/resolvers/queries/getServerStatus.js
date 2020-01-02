const getServerStatus = async (parent, args, context) => {
  const cron = await context.models.Cron.findOne();
  const totalGroups = await context.models.Group.count();
  const totalSubjects = await context.models.Subject.count();

  return {
    updatedAt: cron.lastCall,
    totalGroups,
    totalSubjects
  };
};

module.exports = getServerStatus;
