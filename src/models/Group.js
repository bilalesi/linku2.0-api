const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

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
        firstname: String,
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
        place: String,
        day: String
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

groupSchema.plugin(mongoosePaginate);

const Group = mongoose.model('Group', groupSchema);

module.exports = Group;
