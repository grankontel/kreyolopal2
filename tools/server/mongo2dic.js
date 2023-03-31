require('dotenv').config({ path: `${__dirname}/.env` })
const fs = require('fs')
const path = require('path')
const { MongoClient } = require('mongodb')

const config = {
  mongodb: {
    // uri: process.env.MONGODB_URI,
    host: process.env.MONGODB_HOST,
    user: process.env.MONGODB_USER,
    password: process.env.MONGODB_PASSWORD,
    db: process.env.MONGODB_DB,
    port: Number(process.env.MONGODB_PORT || 27017),
  },
}

config.mongodb.uri = `mongodb://${config.mongodb.user}:${encodeURIComponent(
  config.mongodb.password
)}@${config.mongodb.host}:${config.mongodb.port}/${config.mongodb.db}`

// Connection URL
const client = new MongoClient(config.mongodb.uri)

// Database Name
const dbName = 'zakari'

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index
}

async function main() {
  // Use connect method to connect to the server
  await client.connect()
  console.log('Connected successfully to server')
  const db = client.db(dbName)
  const collection = db.collection('words')

  const projection = { entry: 1, variations: 1, 'definitions.gp.nature': 1 }

  const cursor = collection.find({}, { projection })

  //client.close()

  let data = []
  const stuff = await cursor
    .map((item) => {
      const natures = item.definitions['gp']
        .map((x) => x.nature)
        .flat()
        .filter(onlyUnique)
        .filter((x) => ['nom', 'verbe'].includes(x))
      return {
        words: item.variations,
        flags: natures.map((x) => {
          if (x === 'nom') return 'A'
          if (x === 'verbe') return 'RW'
        }),
      }
    })
    .forEach((item) => {
        console.log(item.words)
      const hasFlags = item.flags.length > 0
      const flags = item.flags.join('')
      const elem = item.words
        .filter((a) => a.length > 0)
        .map((w) => (hasFlags ? `${w}/${flags}` : w))

      data.push(elem)
    })

  data = data.flat().sort((a, b) => {
    return a.toLowerCase().localeCompare(b.toLowerCase())
  })
  cursor.close()

  fs.promises
    .open(path.join(__dirname, '../../import/var/cpf_GP.dic'), 'w')
    .then(async (handle) => {
      await handle.write(`${data.length}\n`)
      data.forEach(async (item) => {
        await handle.write(`${item}\n`)
      })
      return handle
    })
    .then((h) => h.close())

  return 'done.'
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close())
