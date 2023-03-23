const dico = require('../sources/old_dico.json')
const fs = require('fs')
const path = require('path')

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index
}

const neodico = dico.map((item) => {
  return {
    entry: item.wfs[0],
    variations: item.wfs,
    definitions: {
      gp: item.defs.map((d) => {
        return {
          nature: d.nat,
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

// remove entries with no known nature
const mydico = merged
  .filter((item) => {
    const defs = item.definitions.gp.filter((d) => {
      return d.synonyms.length > 0
    })

    return defs.length > 0
  })
  .map((item) => {
    return {
      entry: item.entry,
      synonyms: item.definitions.gp
        .map((x) => {
          return x.synonyms
        })
        .flat()
        .join(','),
    }
  })

fs.promises
  .open(path.join(__dirname, '../import/var/syns.csv'), 'w')
  .then(async (handle) => {
    await handle.write('entry;synonyms;\n')
    mydico.forEach(async (item) => {
      await handle.write(`${item.entry};${item.synonyms};\n`)
    })
    return handle;
  }).then(h => h.close())

// write JSON string to a file
/* 
fs.writeFile(
  path.join(__dirname, '../import/var/syns.json'),
  JSON.stringify(mydico),
  (err) => {
    if (err) {
      throw err
    }
    console.log('Syns data is saved.')
  }
)
 */