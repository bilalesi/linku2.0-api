const mongoose = require('mongoose');

const { Schema } = mongoose;

const subjectSchema = new Schema(
  {
    name: String,
    departmentName: String,
    code: String,
    number: String
  },
  {
    timestamps: true
  }
);

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
