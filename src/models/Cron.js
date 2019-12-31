const mongoose = require('mongoose');

const { Schema } = mongoose;

const fields = {
  lastCall: Date,
};

const cronSchema = new Schema(fields, {
  timestamps: true
});

cronSchema.methods.getId = function getId() {
  const doc = this.toObject();
  // eslint-disable-next-line no-underscore-dangle
  return doc._id.toString();
};

const Cron = mongoose.model('Cron', cronSchema);

module.exports = Cron;
