import { promisify } from 'util'
import fs from 'fs'
import path from 'path'

const readFile = promisify(fs.readFile)

/**
 * Read dictionary files for a kreyol
 * @param {string} kreyol Wich kreyol
 */
// eslint-disable-next-line no-unused-vars
async function readDicoFiles(kreyol: KreyolLang): Promise<DicoFile> {
  const readAff = readFile(
    path.resolve(__dirname, `../../dico/cpf_${kreyol}.aff`),
    'utf8'
  )
  const readDic = readFile(
    path.resolve(__dirname, `../../dico/cpf_${kreyol}.dic`),
    'utf8'
  )

  const affix = Buffer.from(await readAff)
  const dictionary = Buffer.from(await readDic)

  return { affix, dictionary }
}

export default { readDicoFiles }
