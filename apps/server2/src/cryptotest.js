const crypto = require('node:crypto')

const generatePassword = (
  length = 20,
  wishlist = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz~!@-#$'
) =>
  Array.from(crypto.randomFillSync(new Uint32Array(length)))
    .map((x) => wishlist[x % wishlist.length])
    .join('')

console.log(
  generatePassword(
    32,
    '0123456789ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz'
  )
)
console.log(crypto.randomUUID())

const myKey = '0eSHS1tUVnBj9XTj4q56n4eydcqxePRv'

/*
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  your-256-bit-secret
)
*/

let bidule = {
  email: 'tmalo@toto.com',
  pipo: 18,
}

let src = JSON.stringify(bidule) //JSON.stringify('stackabuse.com');
let buff = Buffer.from(src, 'utf-8')
let base64data = buff.toString('base64')

console.log('"' + src + '" converted to Base64 is "' + base64data + '"')

function NOW() {
  var date = new Date()
  var aaaa = date.getUTCFullYear()
  var gg = date.getUTCDate()
  var mm = date.getUTCMonth() + 1

  if (gg < 10) gg = '0' + gg

  if (mm < 10) mm = '0' + mm

  var cur_day = aaaa + mm + gg

  var hours = date.getUTCHours()
  var minutes = date.getUTCMinutes()
  var seconds = date.getUTCSeconds()

  if (hours < 10) hours = '0' + hours

  if (minutes < 10) minutes = '0' + minutes

  if (seconds < 10) seconds = '0' + seconds

  return cur_day + hours + minutes + seconds
}

const nonce = NOW()
let buffNonce = Buffer.from(nonce, 'utf-8')
let base64Nonce = buffNonce.toString('base64')
const tosign = base64Nonce + '.' + base64data

console.log('tosign : ' + tosign)

//creating hmac object
var hmac = crypto.createHmac('sha3-256', myKey)
//passing the data to be hashed
data = hmac.update(tosign)
//Creating the hmac in the required format
gen_hmac = data.digest('hex')
//Printing the output on the console
console.log('hmac : ' + gen_hmac)

console.log('signature : ' + nonce + '.' + gen_hmac)
