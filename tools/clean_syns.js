const lineByLine = require('n-readlines')
const path = require('path')
const fs = require('fs')

const fname = path.join(__dirname, '../sources/update_syns.csv')

const csvfile = path.resolve(fname)
const datafile = path.resolve(__dirname, '../import/var/entries.json')

const liner = new lineByLine(csvfile)

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index
}

let line
let lineNumber = 0
let entries = []

while ((line = liner.next())) {
  // console.log('Line ' + lineNumber)
  const values = line.toString('utf8').split(';')

  let ent = values[0].replaceAll(' ', ' ').trim()
  if (ent === '' || ent === 'entry') {
    lineNumber++
    continue
  }

  let syns = values[1]
    .split(',')
    .map((x) => x.replaceAll(' ', ' ').trim())
    .filter(onlyUnique)
    .sort()
    .join(',')
  entries.push({
    entry: ent,
    synonyms: syns,
  })
  lineNumber++
}

console.log('end of line reached')

fs.promises
  .open(path.join(__dirname, '../import/var/syns2.csv'), 'w')
  .then(async (handle) => {
    await handle.write('entry;synonyms;\n')
    entries.forEach(async (item) => {
      await handle.write(`${item.entry};${item.synonyms};\n`)
    })
    return handle
  })
  .then((h) => h.close())

console.log('destination file written')
