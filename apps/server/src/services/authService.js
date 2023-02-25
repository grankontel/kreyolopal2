import logger from './logger'
import config from '../config'
const Promise = require('bluebird')
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')
const { SHA3 } = require('sha3')
import db from '../database/models'
// import userService from './userService'

const { sequelize } = db
const user = db.User

const argonOptions = {
  type: argon2.argon2i,
  memoryCost: config.security.memoryCost,
  hashLength: config.security.hashLength,
  timeCost: config.security.iterations,
}

/**
 * Hash the provided plain password
 * @param {string} plain Plain password
 * @returns hashed password
 */
const hashPassword = async function (plain) {
  const res = await argon2.hash(plain, config.security.salt, argonOptions)
  return res
}

/**
 * Generate a hash
 * @param {string} data the data to make the hash for
 */
function generateHash(data) {
  const hash = new SHA3(256)

  hash.update(data)
  return hash.digest('hex')
}

const generateVerifToken = (userpart) => {
  const stamp = Date.now()
  return generateHash(`${stamp}:${userpart}:${config.security.token}`)
}

export const authService = {
  hashPassword,
  generateVerifToken,
}

export default authService
