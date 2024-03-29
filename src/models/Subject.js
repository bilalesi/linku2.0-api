const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const { Schema } = mongoose;

const subjectSchema = new Schema(
  {
    name: String,
    departmentName: String,
    code: String,
    number: String,
    mat: {
      type: String,
      unique: true
    }
  },
  {
    timestamps: true
  }
);

// subjectSchema.index({'$**': 'text'});
subjectSchema.index({ name: 'text' });

subjectSchema.methods.getId = function getId() {
  const doc = this.toObject();
  // eslint-disable-next-line no-underscore-dangle
  return doc._id.toString();
};

subjectSchema.plugin(mongoosePaginate);

const Subject = mongoose.model('Subject', subjectSchema);

module.exports = {
  subjectSchema,
  Subject
};
