const fs = require('fs')
const path = require('path')
const { EOL } = require('os')
const { MongoClient } = require('mongodb')
const config = require('./mongoconfig')


const outputFile = path.join(__dirname, `../../sources/converted/missing.txt`)

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index
}

/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

const filter = {
  $or: [
    {
      'definitions.gp.confer': {
        $ne: [],
      },
    },
    {
      'definitions.gp.synonyms': {
        $ne: [],
      },
    },
  ],
}
const projection = {
  entry: 1,
  'definitions.gp.synonyms': 1,
  'definitions.gp.confer': 1,
}

const client = new MongoClient(
  config.mongodb.uri,
  { useNewUrlParser: true, useUnifiedTopology: true }
)

const missing = []
async function main() {
  await client.connect()
  const coll = client.db('zakari').collection('words')
  const cursor = coll.find(filter, { projection })
  const entries = await cursor.toArray()
  cursor.close()

  const relatedList = entries
    .map((entry) => {
      const syns = entry.definitions.gp
        .map((def) => {
          return def.synonyms
        })
        .flat()
      const confer = entry.definitions.gp
        .map((def) => {
          return def.confer
        })
        .flat()
      return syns.concat(confer)
    })
    .flat()
    .filter(onlyUnique)

  // console.log(`${relatedList.length} related items`)

  const cursA = coll.find({ variations: 'obò' })
  await cursA
    .toArray()
    .then((isFound) => {
        console.log(isFound)
      if (isFound === null || isFound.length === 0) {
        console.log(`obò seems missing`)
        // missing.push(item)
      }
    })
    .then(() => {
      return cursA.close()
    })

  const findPromises = relatedList.map((item) => {
    const curs = coll.find({ variations: item })
    return curs
      .toArray()
      .then((isFound) => {
        if (isFound === null || isFound.length === 0) {
          // console.log(`${item} seems missing`)
          missing.push(item)
        }
      })
      .then(() => {
        return curs.close()
      })
  })

  await Promise.all(findPromises)
  await client.close()

  fs.writeFile(
    outputFile,
    '\ufeff' + missing.join(EOL),
    { encoding: 'utf8' },
    (err) => {
      if (err) {
        throw err
      }
      console.log(`${missing.length} items saved in missing.txt .`)
    }
  )
}

main()
