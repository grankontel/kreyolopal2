const fs = require('fs')
const path = require('path')
const {EOL} = require('os');

const { argv } = require('node:process')

const jsonname = argv[2]

if (!jsonname?.length > 0) {
  console.error('No json filename provided')
  process.exit(1)
}

const csvname = argv[3]

if (!csvname?.length > 0) {
  console.error('No csv filename provided')
  process.exit(1)
}

const outputFile = path.join(__dirname, `../sources/converted/${csvname}`)
const dico = require(path.resolve(jsonname))

const data = [];
data.push(`entry;definition_no;nature;definition_fr;usage;synonyme;`)

dico.forEach((item) => {
  item.definitions.gp.forEach((def, index) => {
    const natures = def.nature.map(n => n.trim().toLowerCase()).join(',')
    const usages = def.usage.map(n => n?.trim()).join(',')
    const synonymes = def.synonyms.map(n => n.trim().toLowerCase()).join(',')
    data.push(`${item.entry.trim().toLowerCase()};${index};${natures};${def.meaning.fr.trim()};${usages};${synonymes};`)
    // console.log(`${item.entry};${index};${natures};${def.meaning.fr};${usages}`)
  })
})

fs.writeFile(
    outputFile,
    '\ufeff' + data.join(EOL),
    { encoding: 'utf8' },
    (err) => {
      if (err) {
        throw err
      }
      console.log('needUpdate is saved.')
    }
  )

