import express from 'express'
import authCtrl from '../controllers/auth.controller.js'
import ctrl from '../controllers/session.controller.js'

const router = express.Router()

router.route('/api/sessions')
  .get(authCtrl.requireSignin, ctrl.list)
  .post(authCtrl.requireSignin, ctrl.create)

router.route('/api/sessions/:sessionId')
  .put(authCtrl.requireSignin, ctrl.update)
  .delete(authCtrl.requireSignin, ctrl.remove)

export default router
