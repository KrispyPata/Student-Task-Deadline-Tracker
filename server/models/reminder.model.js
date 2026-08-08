import mongoose from 'mongoose'

const ReminderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: 'Reminder name is required',
      trim: true,
    },

    frequency: {
      type: String,
      trim: true,
      default: 'Once',
    },

    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      default: null,
    },

    sendTime: {
      type: String,
      trim: true,
      default: '',
    },

    sendType: {
      type: String,
      trim: true,
      default: 'In App',
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  },
)

export default mongoose.model('Reminder', ReminderSchema)