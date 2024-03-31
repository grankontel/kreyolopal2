const lineByLine = require('n-readlines')
const path = require('path')
const fs = require('fs')
const { argv } = require('node:process')

const ENTRY_FIELD = 0
const VARIATIONS_FIELD = 1
const DEFINITION_RANK_FIELD = 2
const NATURE_FIELD = 3
const MEANING_FR_FIELD = 4
const USAGE_FIELD = 5
const SYNONYMS_FIELD = 6
const CONFER_FIELD = 7

const fname = argv[2]

if (!fname?.length > 0) {
  console.error('No filename provided')
  process.exit(1)
}

const csvfile = path.resolve(fname)
const datafile = path.resolve(__dirname, '../import/var/entries2.json')
fs.mkdirSync(path.dirname(datafile), { recursive: true })

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
  'modale',
  'personnel',
  'impersonnel',
  'possessif',
  'postposé',
  'pronominale',
  'subordination',
  'sériel',
]

let line
let lineNumber = 0
let errors = 0

let entry = ''
let entries = []
let existingEntries = []

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
  if (['noun', 'nm', 'nomn', 'non'].includes(nat)) return 'nom'
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

function removeAccents(str) {
  return str
    .replaceAll('à', 'a_')
    .replaceAll('ò', 'o_')
    .replaceAll('é', 'e_')
    .replaceAll('è', 'e_')
}

let rank = 0
let radix = ''
let newEntry = {}
while ((line = liner.next())) {
  // console.log('Line ' + lineNumber)
  const values = line.toString('utf8').split(';')
  let ent = values[ENTRY_FIELD].replaceAll(' ', ' ').trim()
  if (ent === '' || values[VARIATIONS_FIELD] === 'variations') {
    lineNumber++
    continue
  }

  if (entry !== ent) {
    const vari = values[VARIATIONS_FIELD].split('/').map((x) => x.trim())
    // new entry
    let newEntry = {
      entry: ent,
      docType: 'entry',
      // make sure entry is the first variations
      variations: [ent, ...vari.filter((x) => x != ent)],
    }
    existingEntries.push(newEntry)
    entries.push(newEntry)
    entry = ent
    rank = 0
    radix = removeAccents(ent) // Buffer.from(ent, 'utf-8').toString('ascii')
  }

  // add definition
  let definition = {
    entry: ent,
    docType: 'definition',
    definition_id: `${radix}_${rank}`,
    kreyol: 'gp',
    rank: rank++,
  }

  try {
    if (values[NATURE_FIELD].trim() == 'nom propre') {
      definition.nature = ['nom propre']
    } else {
      let cleanats = values[NATURE_FIELD].trim().replace(' de ', ' ')
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
            `\t entry : ${entry}, line : ${lineNumber} ; ${values[NATURE_FIELD].trim()} inconnu`
          )
          errors++
        }
      }
    }
  } catch (e) {
    console.error(`error at line ${lineNumber}`)
    console.log(e)
    process.exit(1)
  }

  definition.meaning = {}
  definition.meaning.gp = ''
  definition.meaning.fr = values[MEANING_FR_FIELD]?.trim().replaceAll(' ', '')
  definition.usage = values[USAGE_FIELD].split('/')
    .map((x) => x.trim().replaceAll(' ', ''))
    .filter((y) => y.length > 0)
  definition.synonyms = values[SYNONYMS_FIELD].split(',')
    .map((x) => x.trim())
    .filter((y) => y.length > 0)
  definition.confer = values[CONFER_FIELD]?.split('/')
    .map((x) => x.trim())
    .filter((y) => y.length > 0)
    .filter((s) => !newEntry.variations?.includes(s) && !definition.synonyms.includes(s))
  definition.quotes = []

  entries.push(definition)
  lineNumber++
}

console.log('end of line reached')
console.log(`${entries.length} entries`)
console.log(`${errors} errors`)

// verify synonyms and confer
for (let index = 0; index < entries.length; index++) {
  const element = entries[index]
  if (element.docType == 'entry') continue

  if (element.synonyms.length > 0) {
    const realSynonyms = element.synonyms.map((syn) => {
      return existingEntries.find((x) => x.variations.includes(syn))?.entry
    })
    element.synonyms = realSynonyms.filter((x) => x !== undefined)
  }

  if (element.confer.length > 0) {
    const realConfer = element.confer.map((syn) => {
      return existingEntries.find((x) => x.variations.includes(syn))?.entry
    })
    element.confer = realConfer.filter((x) => x !== undefined)
  }
}
// write JSON string to a file
fs.writeFile(datafile, JSON.stringify(entries, null, 2), (err) => {
  if (err) {
    throw err
  }
  console.log('Dico data is saved.')
})
