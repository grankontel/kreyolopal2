// const Typo = require('typo-js')
import Typo from 'typo-js'

const createSpellchecker = (affix, dictionary) => {
  const diko = new Typo('cpf_GP', affix.toString(), dictionary.toString())
  return {
    check: (word: string) => diko.check(word),
    suggest: (word: string) => diko.suggest(word),
  }
}

export default createSpellchecker
