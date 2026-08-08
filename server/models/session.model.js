import mongoose from 'mongoose'

const SessionSchema = new mongoose.Schema({
  name: { type: String, trim: true, required: 'Session name is required' },
  frequency: { type: String, trim: true, default: '' },
  purpose: { type: String, trim: true, default: '' },
  startTime: { type: String, trim: true, default: '' },
  endTime: { type: String, trim: true, default: '' },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
}, { timestamps: true })

export default mongoose.model('Session', SessionSchema)
