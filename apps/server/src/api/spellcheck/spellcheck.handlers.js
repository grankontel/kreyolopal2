import { validationResult } from 'express-validator'
import config from '../../config'
import logger from '../../services/logger'
import spellchecker from './lib.spellcheck'
import slackWebhook from '../../services/slack'
const { Op } = require('sequelize')
const Promise = require('bluebird')

import db from '../../database/models'
const { User, Spellchecked: Msg, Rating } = db

const postSpellCheck = async (req, res) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ status: 'error', errors: errors.array() })
  }

  const profile = await User.findByPk(req.user.id)
  logger.info(profile)
  if (profile === null) {
    return res.status(401).json({
      status: 'error',
      code: 401,
      message: 'Unauthorized',
      error: new Error('Unauthorized'),
    })
  }

  const lMessage = {
    user: req.user.id,
    tool: req.headers['user-agent'],
    service: 'spellcheck',
    kreyol: req.body.kreyol,
    request: req.body.request.replace(/ç/, 's'),
  }

  // var message = cloneDeep(_message);

  return spellchecker
    .check(lMessage)
    .then(async (response) => {
      const msg = await Msg.create({
        userId: lMessage.user,
        kreyol: lMessage.kreyol,
        request: lMessage.request,
        message: response.message,
        status: response.status,
        response,
      })

      return msg
    })
    .tap((savedMsg) => {
      if (config.slack.noSend) {
        return
      }

      const checkedMsg = savedMsg.response
      if (!checkedMsg.unknown_words.length) {
        return
      }

      const wlist = checkedMsg.unknown_words.join(',')
      const str = `Words [${wlist}] are unknown.\nMessage id : ${savedMsg?.id}`

      try {
        slackWebhook.send({ text: str })
      } catch (eSlack) {
        logger.error(eSlack)
      }
    })
    .then(async (msg) => {
      lMessage.response = { id: msg.id, ...msg.response }
      res.status(200).json(lMessage)
      return lMessage
    })
}

const postRating = async (req, res) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(422).json({ status: 'error', errors: errors.array() })
  }
  const msgId = req.params.id
  const { rating, user_correction, user_notes } = req.body

  return new Promise((resolve, reject) => {
    Msg.findByPk(msgId).then(
      (message) => {
        if (req.user.id !== message.userId) {
          reject({
            status: 'error',
            code: 401,
            message: 'Unauthorized',
            error: new Error('Unauthorized'),
          })
          return
        }

        Rating.findAll({
          where: {
            spellcheckedId: msgId,
          },
        }).then((ratings) => {
          if (ratings.length === 0) {
            Rating.create({
              spellcheckedId: msgId,
              rating,
              user_correction,
              user_notes,
            }).then(
              (obj) => {
                resolve(obj)
              },
              (err) => reject({ status: 'error', code: 500, error: [err] })
            )
          } else {
            const yourRating = ratings[ratings.length - 1]
            const value = {}

            value.rating = rating
            if (user_correction !== undefined)
              value.user_correction = user_correction
            if (user_notes !== undefined) value.user_notes = user_notes

            yourRating.update(value).then(
              (obj) => {
                resolve(obj)
              },
              (err) => reject({ status: 'error', code: 500, error: [err] })
            )
          }
        })
      },
      (reason) => {
        logger.error(reason)
        reject(reason)
      }
    )
  }).then(
    (result) => {
      return res.status(200).json({ id: result.id })
    },
    (reason) => res.status(500).json(reason)
  )
}

function sqlPrepare(req, paramQuerySQL) {
  let { sort, limit } = req.query
  const { name, order, offset } = req.query
  // sort par defaut si param vide ou inexistant
  if (
    typeof sort === 'undefined' ||
    !['asc', 'desc'].includes(sort.toLowerCase())
  ) {
    sort = 'ASC'
  }
  // Recherche LIKE '%%'
  if (typeof name !== 'undefined' && name !== '') {
    paramQuerySQL.where.name = {
      [Op.like]: `%${name}%`,
    }
  }
  // order by
  if (typeof order !== 'undefined' && ['name'].includes(order.toLowerCase())) {
    paramQuerySQL.order = [[order, sort]]
  }
  // limit
  if (typeof limit === 'undefined' || limit === '') {
    limit = 20
  } else {
    limit = parseInt(limit, 10)
  }

  paramQuerySQL.limit = limit

  // offset
  if (typeof offset !== 'undefined' && offset !== '' && offset > 0) {
    paramQuerySQL.offset = parseInt(offset, 10)
  }
}

const getSpellChecks = async (req, res) => {
  const paramQuerySQL = {}
  paramQuerySQL.include = {
    model: Rating,
    attributes: [
      'rating',
      'user_correction',
      'user_notes',
      'admin_correction',
      'admin_notes',
    ],
  }

  paramQuerySQL.attributes = ['id', 'request', 'response']
  paramQuerySQL.where = {
    userId: {
      [Op.eq]: req.user.id,
    },
  }

  sqlPrepare(req, paramQuerySQL)

  Msg.findAndCountAll(paramQuerySQL).then((items) =>
    res.json({
      error: false,
      count: items.count,
      data: items.rows,
    })
  )
}

export default { postSpellCheck, postRating, getSpellChecks }
