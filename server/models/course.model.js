import mongoose from 'mongoose'

const CourseSchema = new mongoose.Schema({
  name: { type: String, trim: true, required: 'Course name is required' },
  description: { type: String, trim: true, default: '' },
  startDate: { type: Date },
  endDate: { type: Date },
  schedule: { type: String, trim: true, default: '' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
}, { timestamps: true })

export default mongoose.model('Course', CourseSchema)
