const mongoose = require('mongoose');

const { Schema } = mongoose;

const fields = {
  name: String,
  departmentName: String,
  code: String,
  number: String
};

const subjectSchema = new Schema(fields, {
  timestamps: true
});

subjectSchema.methods.getId = function getId() {
  const doc = this.toObject();
  // eslint-disable-next-line no-underscore-dangle
  return doc._id.toString();
};

const Subject = mongoose.model('Subject', subjectSchema);

module.exports = {
  subjectSchema,
  Subject
};
