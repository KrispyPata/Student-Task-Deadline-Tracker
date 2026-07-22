import mongoose from 'mongoose'

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: 'Assignment name is required',
  },
  course: {
    type: String,
    trim: true,
    required: 'Course name is required',
  },
  dueDate: {
    type: Date,
    required: 'Due date is required',
  },
  status: {
    type: String,
    enum: ['Not Started', 'In Progress', 'Done'],
    default: 'Not Started',
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
}, { timestamps: true })

export default mongoose.model('Task', TaskSchema)
