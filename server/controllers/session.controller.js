import Session from '../models/session.model.js'
import errorHandler from './error.controller.js'

const list = async (req, res) => {
  try {
    const items = await Session.find({ owner: req.auth._id }).sort({ createdAt: -1 })
    return res.json(items)
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

const create = async (req, res) => {
  try {
    const item = new Session({ ...req.body, owner: req.auth._id })
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
    const item = await Session.findOneAndUpdate(
      { _id: req.params.sessionId, owner: req.auth._id },
      payload,
      { new: true, runValidators: true },
    )
    if (!item) return res.status(404).json({ error: 'Session not found' })
    return res.json(item)
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

const remove = async (req, res) => {
  try {
    const item = await Session.findOneAndDelete({
      _id: req.params.sessionId,
      owner: req.auth._id,
    })
    if (!item) return res.status(404).json({ error: 'Session not found' })
    return res.json({ message: 'Session deleted' })
  } catch (err) {
    return res.status(400).json({ error: errorHandler.getErrorMessage(err) })
  }
}

export default { list, create, update, remove }
