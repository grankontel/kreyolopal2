// const Typo = require('typo-js')
import Typo from 'typo-js'

export interface Spellchecker {
  check: (word: string) => boolean,
  suggest: (word: string) => string[],

}

const createSpellchecker = (affix: Buffer | string, dictionary: Buffer | string): Spellchecker => {
  const diko = new Typo('cpf_GP', affix.toString(), dictionary.toString())
  return {
    check: (word: string) => diko.check(word),
    suggest: (word: string) => diko.suggest(word),
  }
}

export default createSpellchecker
