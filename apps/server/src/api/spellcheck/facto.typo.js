const Typo = require('typo-js')

const createSpellchecker = (affix, dictionary) => {
  const diko = new Typo('cpf_GP', affix.toString(), dictionary.toString())
  return {
    check: (word) => diko.check(word),
    suggest: (word) => diko.suggest(word),
  }
}

export default createSpellchecker
