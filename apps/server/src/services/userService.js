import logger from './logger'
import authService from './authService'
const Promise = require('bluebird')

import db from '../database/models'

const { sequelize } = db
const user = db.User

const findbyEmail = (email) => {
  return user
    .findOne({ where: { email } })
    .then(
      (record) => record,
      (reason) => {
        logger.error(reason)
        return null
      }
    )
    .catch((error) => {
      logger.error(error)
      return null
    })
}

const resetPwdToken = (email) => {
  return new Promise((resolve, reject) => {
    findbyEmail(email).then((record) => {
      if (!record) reject(new Error(`cannot find user for : ${email}`))

      record.reset_pwd_token = authService.generateVerifToken(record.email)
      record.save()
      resolve(record)
    })
  })
}

const register = (record) => {
  return new Promise((resolve, reject) => {
    sequelize.sync().then(
      () => {
        const myrecord = record
        myrecord.email_verif_token = authService.generateVerifToken(
          record.email
        )

        authService
          .hashPassword(record.password)
          .then(
            (hashedpwd) => {
              myrecord.password = hashedpwd
              return myrecord
            },
            (error) => reject(error)
          )
          .then((_record) => {
            user
              .create(_record)
              .then(
                (aUser) => {
                  resolve(aUser)
                },
                (reason) => {
                  logger.error('register rejected')
                  reject(reason.errors[0].message)
                }
              )
              .catch((error) => {
                logger.error('register exception')
                reject(error)
              })
          })
      },
      (reason) => reject(reason)
    )
  })
}

export const userService = {
  findbyEmail,
  resetPwdToken,
  register,
}

export default userService
