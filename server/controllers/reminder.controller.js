import Reminder from '../models/reminder.model.js'

const create = async (req, res) => {
  try {
    const reminder = new Reminder({
      name: req.body.name,
      frequency: req.body.frequency || 'Once',
      task: req.body.task || null,
      sendTime: req.body.sendTime || '',
      sendType: req.body.sendType || 'In App',
      owner: req.auth._id,
    })

    const savedReminder = await reminder.save()

    const populatedReminder = await Reminder.findById(
      savedReminder._id,
    ).populate('task', 'title course dueDate')

    return res.status(201).json(populatedReminder)
  } catch (err) {
    console.error('Create reminder error:', err)

    return res.status(400).json({
      error: err.message,
    })
  }
}

const list = async (req, res) => {
  try {
    const reminders = await Reminder.find({
      owner: req.auth._id,
    })
      .populate('task', 'title course dueDate')
      .sort({
        createdAt: -1,
      })

    return res.json(reminders)
  } catch (err) {
    console.error('List reminder error:', err)

    return res.status(400).json({
      error: err.message,
    })
  }
}

const update = async (req, res) => {
  try {
    const reminder = await Reminder.findOneAndUpdate(
      {
        _id: req.params.reminderId,
        owner: req.auth._id,
      },
      {
        name: req.body.name,
        frequency: req.body.frequency,
        task: req.body.task || null,
        sendTime: req.body.sendTime,
        sendType: req.body.sendType,
      },
      {
        new: true,
        runValidators: true,
      },
    ).populate(
      'task',
      'title course dueDate',
    )

    if (!reminder) {
      return res.status(404).json({
        error: 'Reminder not found',
      })
    }

    return res.json(reminder)
  } catch (err) {
    console.error('Update reminder error:', err)

    return res.status(400).json({
      error: err.message,
    })
  }
}

const remove = async (req, res) => {
  try {
    const reminder =
      await Reminder.findOneAndDelete({
        _id: req.params.reminderId,
        owner: req.auth._id,
      })

    if (!reminder) {
      return res.status(404).json({
        error: 'Reminder not found',
      })
    }

    return res.json({
      message: 'Reminder deleted successfully',
    })
  } catch (err) {
    console.error('Delete reminder error:', err)

    return res.status(400).json({
      error: err.message,
    })
  }
}

export default {
  create,
  list,
  update,
  remove,
}