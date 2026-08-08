import Course from '../models/course.model.js'
import errorHandler from './error.controller.js'

const list = async (req, res) => {
  try {
    const items = await Course.find({ owner: req.auth._id }).sort({ createdAt: -1 })
    return res.json(items)
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

const create = async (req, res) => {
  try {
    const item = new Course({ ...req.body, owner: req.auth._id })
    await item.save()
    return res.status(201).json(item)
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

const update = async (req, res) => {
  try {
    const payload = { ...req.body }
    delete payload.owner
    const item = await Course.findOneAndUpdate(
      { _id: req.params.courseId, owner: req.auth._id },
      payload,
      { new: true, runValidators: true },
    )
    if (!item) return res.status(404).json({ error: 'Course not found' })
    return res.json(item)
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

const remove = async (req, res) => {
  try {
    const item = await Course.findOneAndDelete({
      _id: req.params.courseId,
      owner: req.auth._id,
    })
    if (!item) return res.status(404).json({ error: 'Course not found' })
    return res.json({ message: 'Course deleted' })
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

export default { list, create, update, remove }
