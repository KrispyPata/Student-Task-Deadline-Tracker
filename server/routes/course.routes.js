import express from 'express'
import authCtrl from '../controllers/auth.controller.js'
import ctrl from '../controllers/course.controller.js'

const router = express.Router()

router.route('/api/courses')
  .get(authCtrl.requireSignin, ctrl.list)
  .post(authCtrl.requireSignin, ctrl.create)

router.route('/api/courses/:courseId')
  .put(authCtrl.requireSignin, ctrl.update)
  .delete(authCtrl.requireSignin, ctrl.remove)

export default router
