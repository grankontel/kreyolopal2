/* eslint-disable no-plusplus, no-continue */
import NodeCache from 'node-cache'
import bluebird from 'bluebird'
import config from '../../config'
import createSpellchecker from './facto.typo'
import {
  MessageStatus,
  KreyolLang,
  DicoFile,
  DicoFileReader,
} from './spellcheck.types'
const myCache = new NodeCache()

const puncRegex = /^[^A-Za-z0-9_]+$/g
const withDigits = /^([A-Za-z]*)[0-9]+([A-Za-z]*)$/g
const isSpace = /^s+$/g

type spellElement = {
  suggestions: string[]
  word: string
  isCorrect: boolean
}

/**
 * Verify spelling for a string
 * @param {string} src String to spellcheck
 * @param {string} kreyol Wich kreyol
 */
async function nspell_spellcheck(
  src: string,
  kreyol: KreyolLang,
  dicoSource: DicoFileReader
) {
  let affix = ''
  let dictionary = ''

  let value = myCache.get<DicoFile>('dicofiles')
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
  const hunspelled = new Array<spellElement>()

  // build the hunspelled array
  for (let index = 0; index < source.length; index++) {
    const word = source[index]

    // empty
    if (word.length === 0 || isSpace.test(word)) {
      continue
    }

    // non character
    if (puncRegex.test(word)) {
      hunspelled.push({ word, isCorrect: true, suggestions: [] })
      continue
    }

    // non character
    if (withDigits.test(word)) {
      hunspelled.push({ word, isCorrect: true, suggestions: [] })
      continue
    }

    const isCorrect = diko.check(word)
    hunspelled.push({ word, isCorrect, suggestions: [] })
  }

  // add the suggestions
  for (let index = 0; index < hunspelled.length; index++) {
    if (!hunspelled[index].isCorrect) {
      const suggestions = diko.suggest(hunspelled[index].word)
      hunspelled[index].suggestions = suggestions
    }
  }

  const rep_reducer = (acc: string[], item: spellElement) => {
    let nl

    if (item.isCorrect) {
      nl = item.word
    } else if (item.suggestions?.length) {
      [nl] = item.suggestions
    } else {
      nl = `~${item.word}~`
    }

    acc.push(nl)

    return acc
  }

  const response = hunspelled.reduce(rep_reducer, []).join(' ')

  const errors = hunspelled
    .filter((item) => !item.isCorrect && !item.suggestions?.length)
    .map((el) => el.word)

  const reponse = {
    source: src,
    message: response,
    unknown_words: errors,
  }

  diko = undefined

  return reponse
}

const actualCheck = (message: DicoRequest, dicoSource: DicoFileReader) => {
  return new bluebird.Promise<MessageResponse>((resolve, reject) => {
    nspell_spellcheck(message.request, message.kreyol, dicoSource)
      .then((response) => {
        const msgresponse: MessageResponse = {
          // status: '', success | warning | error
          status:
            response.unknown_words.length > 0
              ? MessageStatus.warning
              : MessageStatus.success,
          kreyol: KreyolLang.GP, // message.request.kreyol,
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
  check: (message: DicoRequest) => {
    return new bluebird.Promise((resolve, reject) => {
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
