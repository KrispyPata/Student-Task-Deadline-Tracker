import express from 'express'
import reminderCtrl from '../controllers/reminder.controller.js'
import authCtrl from '../controllers/auth.controller.js'

const router = express.Router()

router
  .route('/api/reminders')
  .get(
    authCtrl.requireSignin,
    reminderCtrl.list,
  )
  .post(
    authCtrl.requireSignin,
    reminderCtrl.create,
  )

router
  .route('/api/reminders/:reminderId')
  .put(
    authCtrl.requireSignin,
    reminderCtrl.update,
  )
  .delete(
    authCtrl.requireSignin,
    reminderCtrl.remove,
  )

export default router