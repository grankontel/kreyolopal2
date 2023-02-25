import config from '../../config'
import logger from '../../services/logger'
import authService from '../../services/authService'

import db from '../../database/models'
const { User } = db

const getProfile = async function (req, res) {
  const userid = req.user.id
  logger.info(`GetProfile`)

  try {
    const profile = await User.findByPk(userid)
    if (profile === null) {
      logger.error('cannot find user')
      logger.error(req.user)
      return res.status(500).json({ status: 'error', error: 'Internal error' })
    }

    const lUser = {
      firstname: profile.firstname,
      lastname: profile.lastname,
      email: profile.email,
    }

    return res.json({
      status: 'success',
      data: { profile: lUser },
    })
  } catch (e) {
    logger.error(e.message)
    res.status(500).send({ error: 'Unknown error.' })
  }
}

const postProfile = async function (req, res) {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ status: 'error', errors: errors.array() })
  }

  const { firstname, lastname } = req.body

  const profile = await User.findByPk(req.user.id)
  if (profile === null) {
    logger.error(`Cannot find user : ${req.user.id}`)
    return res.status(500).json({ status: 'error', error: 'Internal error' })
  }

  profile.firstname = firstname
  profile.lastname = lastname

  return profile.save().then(
    () => {
      res.status(200).send({
        status: 'success',
        data: {},
      })
    },
    (reason) => {
      logger.error(reason)
      return res.status(500).json({ status: 'error', error: 'Internal error' })
    }
  )
}

const postUpdatePwd = async function (req, res) {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ status: 'error', error: errors.array() })
  }

  const { currentPassword, newPassword } = req.body

  const user = await User.findByPk(req.user.id)
  if (user === null) {
    logger.error(`Cannot find user ${req.user.email} in database`)
    return res.status(401).json({
      status: 'error',
      code: 401,
      message: 'Unauthorized',
      error: new Error('Unauthorized'),
    })
  }

  const isValid = await authService.verifyPassword(
    user.password,
    currentPassword
  )

  if (!isValid) {
    return res.status(401).json({
      status: 'error',
      code: 401,
      message: 'Unauthorized',
      error: new Error('Unauthorized'),
    })
  }

  return authService.hashPassword(newPassword).then(
    (hashedPassword) => {
      user.password = hashedPassword
      user.save({ fields: ['password'] }).then(
        () => {
          res.status(200).send({
            status: 'success',
            data: {},
          })
        },
        (reason) => {
          logger.error(reason)
          return res
            .status(500)
            .json({ status: 'error', error: 'Internal error' })
        }
      )
    },
    (reason) => {
      logger.error(`cannot hash password for ${req.user.email}`)
      logger.error(reason)
      return res.status(500).json({ status: 'error', error: 'Internal error' })
    }
  )
}

const postResetPwd = async function (req, res) {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ status: 'error', error: errors.array() })
  }

  const { token, newPassword } = req.body

  const user = await User.findOne({ where: { reset_pwd_token: token } })
  if (user === null) {
    logger.error(`Cannot find user in database`)
    return res.status(401).json({
      status: 'error',
      code: 401,
      message: 'Unauthorized',
      error: new Error('Unauthorized'),
    })
  }

  return authService.hashPassword(newPassword).then(
    (hashedPassword) => {
      user.password = hashedPassword
      user.save({ fields: ['password'] }).then(
        () => {
          res.status(200).send({
            status: 'success',
            data: {},
          })
        },
        (reason) => {
          logger.error(reason)
          return res
            .status(500)
            .json({ status: 'error', error: 'Internal error' })
        }
      )
    },
    (reason) => {
      logger.error(`cannot hash password for ${user.email}`)
      logger.error(reason)
      return res.status(500).json({ status: 'error', error: 'Internal error' })
    }
  )
}

export default { getProfile, postProfile, postUpdatePwd, postResetPwd }
