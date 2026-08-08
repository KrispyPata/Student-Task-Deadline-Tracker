import Task from '../models/task.model.js'
import errorHandler from './error.controller.js'

const list = async (req, res) => {
  try {
    const query = { owner: req.auth._id }

    if (req.query.status) query.status = req.query.status
    if (req.query.course) query.course = req.query.course

    const tasks = await Task.find(query).sort({ dueDate: 1, createdAt: -1 })
    return res.json(tasks)
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

const create = async (req, res) => {
  try {
    const task = new Task({
      title: req.body.title,
      course: req.body.course,
      description: req.body.description || '',
      dueDate: req.body.dueDate,
      status: req.body.status,
      owner: req.auth._id,
    })
    await task.save()
    return res.status(201).json(task)
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

const update = async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.taskId, owner: req.auth._id },
      {
        title: req.body.title,
        course: req.body.course,
        description: req.body.description || '',
        dueDate: req.body.dueDate,
        status: req.body.status,
      },
      { new: true, runValidators: true },
    )

    if (!task) return res.status(404).json({ error: 'Task not found' })
    return res.json(task)
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

const remove = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.taskId,
      owner: req.auth._id,
    })

    if (!task) return res.status(404).json({ error: 'Task not found' })
    return res.json({ message: 'Task deleted' })
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

export default { list, create, update, remove }
