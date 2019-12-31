const mongoose = require('mongoose');

const { Schema, SchemaTypes } = mongoose;

const groupSchema = new Schema(
  {
    nrc: {
      type: String,
      required: true,
      unique: true
    },

    group: String,

    subject: {
      type: SchemaTypes.ObjectId,
      ref: 'Subject',
      require: true
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
        },
        place: String
      }
    ],

    place: String,

    quota: {
      taken: {
        type: Number,
        default: 0
      },
      free: {
        type: Number,
        default: 0
      }
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
