import express from 'express'
import userCtrl from '../controllers/user.controller.js'
import authCtrl from '../controllers/auth.controller.js'

const router = express.Router()

/*
 * Registration
 */
router
  .route('/api/users')
  .post(userCtrl.create)

/*
 * Current user's profile CRUD
 */
router
  .route('/api/users/:userId')
  .get(
    authCtrl.requireSignin,
    userCtrl.read,
  )
  .put(
    authCtrl.requireSignin,
    userCtrl.update,
  )
  .delete(
    authCtrl.requireSignin,
    userCtrl.remove,
  )

export default router