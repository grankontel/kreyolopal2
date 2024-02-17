import { SHA3 } from 'sha3'
import config from '#config'

/**
 * Generate a hash
 * @param {string} data the data to make the hash for
 */
function generateHash(data: string) {
  const hash = new SHA3(256)

  hash.update(data)
  return hash.digest('hex')
}

const generateVerifToken = (userpart) => {
  const stamp = Date.now()
  return generateHash(`${stamp}:${userpart}:${config.security.token}`)
}

export const authService = {
  generateVerifToken,
}
