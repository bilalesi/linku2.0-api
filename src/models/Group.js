const mongoose = require('mongoose');

const { Schema, SchemaTypes } = mongoose;

const groupSchema = new Schema(
  {
    subject: {
      type: SchemaTypes.ObjectId,
      ref: 'Subject'
    },

    professors: [
      {
        name: String,
        lastname: String
      }
    ],
    schedule: [
      {
        startDate: String,
        endDate: String,
        time: {
          start: String,
          end: String
        }
      }
    ],
    quota: {
      taken: Number,
      free: Number
    }
  },
  {
    timestamps: true
  }
);

groupSchema.methods.getId = function getId() {
  const doc = this.toObject();
  // eslint-disable-next-line no-underscore-dangle
  return doc._id.toString();
};

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
