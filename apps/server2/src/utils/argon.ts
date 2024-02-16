import { Argon2id } from 'oslo/password'
import config from '#config'

export const argon2 = new Argon2id({
  memorySize: config.security.memoryCost,
  tagLength: config.security.hashLength,
  iterations: config.security.iterations,
})
