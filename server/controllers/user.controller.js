import User from '../models/user.model.js'

const cleanUser = (user) => {
  const data = user.toObject
    ? user.toObject()
    : { ...user }

  delete data.hashed_password
  delete data.salt
  delete data.password

  return data
}

const create = async (req, res) => {
  try {
    const user = new User(req.body)

    const savedUser =
      await user.save()

    return res
      .status(201)
      .json(
        cleanUser(savedUser),
      )
  } catch (err) {
    return res
      .status(400)
      .json({
        error: err.message,
      })
  }
}

const list = async (req, res) => {
  try {
    const users =
      await User.find()
        .select(
          '-hashed_password -salt',
        )

    return res.json(users)
  } catch (err) {
    return res
      .status(400)
      .json({
        error: err.message,
      })
  }
}

const read = async (req, res) => {
  try {
    const user =
      await User.findById(
        req.params.userId,
      )

    if (!user) {
      return res
        .status(404)
        .json({
          error:
            'User not found',
        })
    }

    /*
     * User may only access
     * their own profile.
     */
    if (
      String(user._id) !==
      String(req.auth._id)
    ) {
      return res
        .status(403)
        .json({
          error:
            'Not authorized',
        })
    }

    return res.json(
      cleanUser(user),
    )
  } catch (err) {
    return res
      .status(400)
      .json({
        error: err.message,
      })
  }
}

const update = async (req, res) => {
  try {
    /*
     * User may only update
     * their own profile.
     */
    if (
      String(
        req.params.userId,
      ) !==
      String(req.auth._id)
    ) {
      return res
        .status(403)
        .json({
          error:
            'Not authorized',
        })
    }

    const updates = {
      name: req.body.name,
      email: req.body.email,
    }

    const user =
      await User.findByIdAndUpdate(
        req.params.userId,
        updates,
        {
          new: true,
          runValidators: true,
        },
      )

    if (!user) {
      return res
        .status(404)
        .json({
          error:
            'User not found',
        })
    }

    return res.json(
      cleanUser(user),
    )
  } catch (err) {
    return res
      .status(400)
      .json({
        error: err.message,
      })
  }
}

const remove = async (req, res) => {
  try {
    if (
      String(
        req.params.userId,
      ) !==
      String(req.auth._id)
    ) {
      return res
        .status(403)
        .json({
          error:
            'Not authorized',
        })
    }

    const user =
      await User.findByIdAndDelete(
        req.params.userId,
      )

    if (!user) {
      return res
        .status(404)
        .json({
          error:
            'User not found',
        })
    }

    return res.json({
      message:
        'Account deleted successfully',
    })
  } catch (err) {
    return res
      .status(400)
      .json({
        error: err.message,
      })
  }
}

export default {
  create,
  list,
  read,
  update,
  remove,
}