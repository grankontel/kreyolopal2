const lineByLine = require('n-readlines')
const path = require('path')
const fs = require('fs')
const { argv } = require('node:process');

const fname = argv[2]

if (! fname?.length > 0) {
    console.error("No filename provided")
    process.exit(1)
}

const csvfile = path.resolve(fname)
const datafile = path.resolve(__dirname, '../import/var/entries.json')

const liner = new lineByLine(csvfile)

const natures = [
  'adjectif',
  'adverbe',
  'article',
  'conjonction',
  'exclamation',
  'expression',
  'interjection',
  'locution',
  'nom',
  'nom propre',
  'numeral',
  'onomatopée',
  'particule',
  'préfixe',
  'préposition',
  'pronom',
  'suffixe',
  'verbe',
]

const subnatures = [
  'adverbiale',
  'aspectuelle',
  'défini',
  'grammaticale',
  'indéfini',
  'interrogatif',
  'négation',
  'numéral',
  'personnel',
  'impersonnel',
  'possessif',
  'postposé',
  'pronominale',
  'subordination',
]

let line
let lineNumber = 0
let errors = 0

let entry = ''
let entries = []
let curitem = {}

/*
  {
    "entry": "abiyé",
    "variations": ["abiyé"],
    "definitions": {
      "gp": [
        {
          "nature": ["verb"],
          "subnature": ["verb"],
          "meaning": { "gp": "", "fr": "habiller, s'habiller, se vêtir . " },
          "usage": ["an ka abiyé an sis-kat-dé"],
          "synonyms": ["lenj"],
          "quotes": []
        }
      ]
    }
  },
*/

function cleanNature(nat) {
  if (natures.includes(nat)) return nat

  if (['vebre', 'verb'].includes(nat)) return 'verbe'
  if (['noun', 'nm','nomn'].includes(nat)) return 'nom'
  if (['adjverbe'].includes(nat)) return 'adverbe'
  if (['adjective', 'adejctif', 'advectif', 'adjecif'].includes(nat)) return 'adjectif'
  if (['pronoun'].includes(nat)) return 'pronom'
  if (['prefixe'].includes(nat)) return 'préfixe'

  return nat
}

function cleanSubNature(nat) {
    if (subnatures.includes(nat)) return nat
  
    if (['posséssif'].includes(nat)) return 'possessif'
  
    return nat
  }
  

while ((line = liner.next())) {
  // console.log('Line ' + lineNumber)
  const values = line.toString('utf8').split(';')
  let ent = values[0].trim()
  if (ent === '' || values[1] === 'variations') {
    lineNumber++
    continue
  }

  if (entry !== ent) {
    // new entry
    if (entry !== '') {
      // valid previous entry

      entries.push(curitem)
      curitem = {}
    }
    entry = ent
    curitem.entry = entry
    curitem.variations = values[1].split('/').map((x) => x.trim())
    curitem.definitions = {}
    curitem.definitions.gp = []
  }

  // add definition
  let definition = {}
  if (values[3].trim() == "nom propre") {
    definition.nature = ["nom propre"]
  } else {
    let cleanats = values[3].trim().replace(" de ", " ")
    let nats = cleanats.split(' ')

    let nat = cleanNature(nats[0])
    definition.nature = [nat]
    if (!natures.includes(nat)) {
      console.log(`\t entry : ${entry}, line : ${lineNumber} ; ${nat} inconnu`)
      errors++
    } else if (nats[1]?.length > 0) {
      let subnature = cleanSubNature(nats[1])
  
      if (subnatures.includes(subnature)) {
        definition.subnature = []
        definition.subnature.push([nat, subnature].join(' '))
      } else {
        console.log(
          `\t entry : ${entry}, line : ${lineNumber} ; ${values[3].trim()} inconnu`
        )
        errors++
      }
    }
  }

  definition.meaning = {}
  definition.meaning.gp = ''
  definition.meaning.fr = values[4].trim().replaceAll(' ', '')
  definition.usage = values[5]
    .split('/')
    .map((x) => x.trim().replaceAll(' ', ''))
  definition.synonyms = values[6].split(',').map((x) => x.trim())
  definition.confer = values[7]
    .split('/')
    .map((x) => x.trim())
    .filter((y) => y.length > 0)
  definition.quotes = []

  curitem.definitions.gp.push(definition)

  lineNumber++
}

console.log('end of line reached')
entries.push(curitem)
console.log(`${entries.length} entries`)
console.log(`${errors} errors`)

// write JSON string to a file
fs.writeFile(datafile, JSON.stringify(entries, null, 2), (err) => {
  if (err) {
    throw err
  }
  console.log('Dico data is saved.')
})
