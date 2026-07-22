import express from 'express'
import authCtrl from '../controllers/auth.controller.js'
import taskCtrl from '../controllers/task.controller.js'

const router = express.Router()

router.route('/api/tasks')
  .get(authCtrl.requireSignin, taskCtrl.list)
  .post(authCtrl.requireSignin, taskCtrl.create)

router.route('/api/tasks/:taskId')
  .put(authCtrl.requireSignin, taskCtrl.update)
  .delete(authCtrl.requireSignin, taskCtrl.remove)

export default router
