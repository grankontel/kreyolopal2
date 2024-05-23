import { Argon2id } from 'oslo/password'
import config from '#config'

function base64ToArrayBuffer(base64: string): ArrayBufferLike {
  var binaryString = atob(base64);
  var bytes = new Uint8Array(binaryString.length);
  for (var i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

export const argon2 = new Argon2id({
  memorySize: config.security.memoryCost,
  tagLength: config.security.hashLength,
  iterations: config.security.iterations,
  secret: base64ToArrayBuffer(config.security.salt),
})
