const crypto = require('crypto')

let hash = crypto.createHash('md5').update('c8e94e4tu645v6t').digest("hex")

console.log(hash)
console.log(hash.slice(hash.length-8))
