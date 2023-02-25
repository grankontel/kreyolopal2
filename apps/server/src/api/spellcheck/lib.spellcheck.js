/* eslint-disable no-plusplus, no-continue */
const NodeCache = require('node-cache')
const Promise = require('bluebird')
import config from '../../config'
import createSpellchecker from './facto.typo'

const myCache = new NodeCache()

const puncRegex = /^[^A-Za-z0-9_]+$/g
const withDigits = /^([A-Za-z]*)[0-9]+([A-Za-z]*)$/g
const isSpace = /^s+$/g

/**
 * Verify spelling for a string
 * @param {string} src String to spellcheck
 * @param {string} kreyol Wich kreyol
 */
async function nspell_spellcheck(src, kreyol, dicoSource) {
  let affix = ''
  let dictionary = ''

  let value = myCache.get('dicofiles')
  if (value !== undefined) {
    affix = value.affix
    dictionary = value.dictionary
  } else {
    value = await dicoSource.readDicoFiles(kreyol)
    if (!config.dico.useLocal) {
      myCache.set('dicofiles', value)
    }
    affix = value.affix
    dictionary = value.dictionary
  }

  let diko = createSpellchecker(affix, dictionary)

  // make an array from string
  const source = src.split(' ')
  const hunspelled = []

  // build the hunspelled array
  for (let index = 0; index < source.length; index++) {
    const word = source[index]

    // empty
    if (word.length === 0 || isSpace.test(word)) {
      continue
    }

    // non character
    if (puncRegex.test(word)) {
      hunspelled.push({ word, isCorrect: true })
      continue
    }

    // non character
    if (withDigits.test(word)) {
      hunspelled.push({ word, isCorrect: true })
      continue
    }

    const isCorrect = diko.check(word)
    hunspelled.push({ word, isCorrect })
  }

  // add the suggestions
  for (let index = 0; index < hunspelled.length; index++) {
    const element = hunspelled[index]

    if (!element.isCorrect) {
      const suggestions = diko.suggest(element.word)
      element.suggestions = suggestions
    }
  }

  const rep_reducer = (acc, item) => {
    let nl
    if (item.isCorrect) {
      nl = item.word
    } else if (item.suggestions.length) {
      ;[nl] = item.suggestions
    } else {
      nl = `~${item.word}~`
    }

    acc.push(nl)

    return acc
  }

  const response = hunspelled.reduce(rep_reducer, []).join(' ')

  const errors = hunspelled
    .filter((item) => !item.isCorrect && !item.suggestions.length)
    .map((el) => el.word)

  const reponse = {
    source: src,
    message: response,
    unknown_words: errors,
  }

  diko = undefined

  return reponse
}

const actualCheck = (message, dicoSource) => {
  return new Promise((resolve, reject) => {
    nspell_spellcheck(message.request, message.kreyol, dicoSource)
      .then((response) => {
        const msgresponse = {
          // status: '', success | warning | error
          status: response.unknown_words.length > 0 ? 'warning' : 'success',
          kreyol: 'GP', // message.request.kreyol,
          unknown_words: response.unknown_words,
          message: response.message,
          user_evaluation: undefined,
          admin_evaluation: undefined,
        }

        resolve(msgresponse)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
const spellchecker = {
  check: (message) => {
    return new Promise((resolve, reject) => {
      if (config.dico.useLocal) {
        import('./lib.fs-dicofile').then((dicoSource) => {
          resolve(actualCheck(message, dicoSource.default))
        })
      } else {
        import('./lib.s3-dicofile').then((dicoSource) => {
          resolve(actualCheck(message, dicoSource.default))
        })
      }
    })
  },
}

export default spellchecker
