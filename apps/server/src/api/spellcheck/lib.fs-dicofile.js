const { promisify } = require('util')
const fs = require('fs')
const path = require('path')

const readFile = promisify(fs.readFile)

/**
 * Read dictionary files for a kreyol
 * @param {string} kreyol Wich kreyol
 */
// eslint-disable-next-line no-unused-vars
async function readDicoFiles(kreyol) {
  const readAff = readFile(
    path.resolve(__dirname, '../../dico/cpf_GP.aff'),
    'utf8'
  )
  const readDic = readFile(
    path.resolve(__dirname, '../../dico/cpf_GP.dic'),
    'utf8'
  )

  const affix = Buffer.from(await readAff)
  const dictionary = Buffer.from(await readDic)

  return { affix, dictionary }
}

export default { readDicoFiles }
