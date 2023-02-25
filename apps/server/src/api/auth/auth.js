import logger from '../../services/logger'
import config from '../../config'
const Promise = require('bluebird')
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')
import db from '../../database/models'
import userService from '../../services/userService'

const { sequelize } = db
const user = db.User

const argonOptions = {
  type: argon2.argon2i,
  memoryCost: config.security.memoryCost,
  hashLength: config.security.hashLength,
  timeCost: config.security.iterations,
}

/**
 * Verify the provided password against the hashed one
 * @param {string} recpassword Recorded password (hashed)
 * @param {string} plainpwd Plain password
 * @returns true if password match
 */
async function verifyPassword(recpassword, plainpwd) {
  logger.info('Verifying password...')
  return argon2.verify(recpassword, plainpwd).then((result) => {
    logger.info(result ? ' ...ok' : ' ...not ok')
    return result
  })
}

export const authenticateUser = (email, password) => {
  return userService
    .findbyEmail(email)
    .then((record) => {
      if (record === null) {
        logger.error(`no user found for ${email}`)
        return false
      }
      logger.debug(JSON.stringify(record))
      return verifyPassword(record.password, password).then((isValid) => {
        logger.debug(`password verifyed for ${email}`)
        return isValid ? record : false
      })
    })
    .catch((error) => {
      logger.error(error)
      return false
    })
}

export const logUserIn = (user, req) => {
  req.user = user
  return new Promise((resolve, reject) => {
    jwt.sign(
      {
        user: {
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
        },
      },
      config.security.token,
      { expiresIn: '1d' },
      (err, token) => {
        if (err) {
          reject(err)
          return
        }

        req.user.lastlogin = new Date()
        req.user.save()

        const payload = { email: req.user.email, jwt: token }
        // Return json web token
        resolve({
          payload,
          setCookie: (res) => {
            // Send Set-Cookie header
            res.cookie('zakari', token, {
              expires: new Date(Date.now() + 48 * 3600000),
              httpOnly: false,
              // sameSite: true,
              secure: true,
            })
          },
        })
      }
    )
  })
}
