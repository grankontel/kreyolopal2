// const dico = require('/Users/tmalo/Documents/dev/wabap/dico.json')
const fs = require('fs')
const path = require('path')
const { argv } = require('node:process')

const fname = argv[2]

if (!fname?.length > 0) {
  console.error('No filename provided')
  process.exit(1)
}

const dico = require(path.resolve(fname))
const datafile = path.resolve(__dirname, '../import/var/dicofile.json')

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index
}

var flatted = dico
  .map((i) => i.defs)
  .flat()
  .map((j) => j.nat)

const n_types = [
  'adjective',
  'adverb',
  'connector',
  'interjection',
  'noun',
  'prefix',
  'preverbal',
  'pronoun',
  'suffix',
  'verb',
]
function properType(oldType) {
  if (oldType === undefined) return ['unknown']
  oldType = oldType.trim()

  if (n_types.indexOf(oldType) != -1) return [oldType]

  if (oldType === 'v') return ['verb']
  if (oldType === 'n') return ['noun']
  if (oldType === 'pr') return ['pronoun']
  if (oldType === 'n et adj') return ['noun', 'adjective']
  if (oldType === 'conjonction') return ['connector']
  if (oldType === 'aonjonction') return ['connector']
  if (oldType.startsWith('conj')) return ['connector']
  if (oldType.startsWith('interj')) return ['interjection']
  if (oldType.startsWith('préfixe')) return ['prefix']
  if (oldType.startsWith('pr.')) return ['pronoun']
  if (oldType.startsWith('pronom')) return ['pronoun']
  if (oldType.startsWith('ptonom')) return ['pronoun']
  if (oldType.startsWith('adv')) return ['adverb']
  if (oldType.startsWith('adj')) return ['adjective']

  const regex_vadj = /v(\s*)\/(\s*)(adj)/gm
  const regex_nadj = /n(\s*)(\/|,)(\s*)(adj)/gm
  const regex_vn = /v(\s*)(\/|,)(\s*)(n)$/gm
  if (regex_vadj.test(oldType)) return ['verb', 'adjective']
  if (regex_nadj.test(oldType)) return ['noun', 'adjective']
  if (regex_vn.test(oldType)) return ['verb', 'noun']
  if (oldType.startsWith('n.')) return ['noun']

  return [oldType]
}

const neodico = dico.map((item) => {
  return {
    entry: item.wfs[0],
    variations: item.wfs,
    definitions: {
      gp: item.defs.map((d) => {
        return {
          nature: properType(d.nat),
          meaning: {
            gp: '',
            fr: d.tsl.fr,
          },
          usage: d.exs ? [d.exs[0]?.gp] : [],
          synonyms: d.syns,
          quotes: [],
        }
      }),
    },
  }
})

// find entries
const entries = neodico.map((item) => item.entry).filter(onlyUnique)

// merge matching entries
const merged = entries.map((item) => {
  const dicoentries = neodico.filter((x) => x.entry === item)
  if (dicoentries.length === 1) return dicoentries[0]

  return {
    entry: item,
    variations: dicoentries
      .map((d) => d.variations)
      .flat()
      .filter(onlyUnique),
    definitions: {
      gp: dicoentries.map((d) => d.definitions.gp).flat(),
    },
  }
})

function onlyThose(n) {
  return n_types.includes(n)
}

/*
// remove entries with no known nature
const mydico = merged.filter((item) => {
  const defs = item.definitions.gp.filter(
    (d) => {
      return (d.nature.filter(onlyThose).length > 0)
    }
  )  

  return (defs.length > 0)
}).map((item) => {
  return {
    entry: item.entry,
    variations: item.variations,
    definitions: {
      gp: item.definitions.gp.map((x) => {
        return {
          nature: x.nature.filter(onlyThose),
          meaning: x.meaning,
          usage: x.usage,
          synonyms: x.synonyms,
          quotes: x.quotes,
        }
      }),
    },
  }
})

const needUpdate = merged.filter((item) => {
  const defs = item.definitions.gp.filter(
    (d) => {
      return (d.nature.filter(onlyThose).length > 0)
    }
  )  

  return (defs.length === 0)
})

*/

// write JSON string to a file
fs.writeFile(datafile, JSON.stringify(merged), (err) => {
  if (err) {
    throw err
  }
  console.log('Dico data is saved.')
})

/*
fs.writeFile(
  path.join(__dirname, '/converted/needUpdate.json'),
  JSON.stringify(needUpdate),
  (err) => {
    if (err) {
      throw err
    }
    console.log('needUpdate is saved.')
  }
)
*/
console.log(dico.length)
console.log(merged.length)
// console.log(mydico.length)
// console.log(needUpdate.length)

/*
var unique = flatted.map(properType).flat().filter(onlyUnique)

unique.map((x) => console.log(x))
console.log("======================================")
unique.filter(x => x.indexOf('=') !==-1).map((x) => console.log(x))

// dico.filter(item => item.defs.map(d => d.nat).flat().indexOf('conjonction') !== -1).map((x) => console.log(x))
// var unique = a.filter(onlyUnique);

// neodico.slice(0, 2).map((x) => console.log(x))

// neodico.slice(0, 2).map((x) => console.log(JSON.stringify(x)))
*/
