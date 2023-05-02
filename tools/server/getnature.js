const { MongoClient } = require('mongodb')
const config = require('./mongoconfig')

/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */

/*
const filter = {
  $or: [
    { 'definitions.gp.nature': 'particule' },
    { 'definitions.gp.nature': 'adverbe' },
  ],
}
*/
const filter = { 'definitions.gp.nature': 'particule' }

const projection = {
  entry: 1,
  'definitions.gp.nature': 1,
  'definitions.gp.subnature': 1,
}

const client = new MongoClient(config.mongodb.uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index
}

async function main() {
  await client.connect()

  const coll = client.db('zakari').collection('words')
  const cursor = coll.find(filter, { projection })
  const result = await cursor.toArray()

  const natures = result.map((item) => {
    return {
      entry: item.entry,
      nature: item.definitions.gp
        .filter(
          (def) =>
            def.nature.includes('particule') || def.nature.includes('adverbe')
        )
        .map((def) => def.subnature || def.nature)
        .flat()
        .filter(onlyUnique),
    }
  })
  console.log(natures)
  await client.close()
}

main()
