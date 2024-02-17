'use strict'

const fs = require('fs')
const { argv } = require('node:process')
const fname = argv[2]

if (!fname?.length > 0) {
  console.error('No filename provided')
  process.exit(1)
}

console.log(`strip devDependencies from ${fname}`)
let rawdata = fs.readFileSync(fname)
let pdata = JSON.parse(rawdata)

delete pdata.devDependencies
pdata.main = 'server.js'
pdata.scripts = {
  start: 'node ./server.js',
}
var content = JSON.stringify(pdata, null, '  ')
fs.writeFileSync(fname, content)
