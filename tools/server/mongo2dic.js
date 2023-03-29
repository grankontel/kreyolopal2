require('dotenv').config({ path: `${__dirname}/.env` })
const { MongoClient } = require('mongodb');

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
const client = new MongoClient(config.mongodb.uri);

// Database Name
const dbName = 'zakari';

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index
  }

  
async function main() {
    // Use connect method to connect to the server
    await client.connect();
    console.log('Connected successfully to server');
    const db = client.db(dbName);
    const collection = db.collection('words');

    // the following code examples can be pasted here...
    const filter = {
        entry: 'kenbé',
    }
    const projection = { entry: 1, variations: 1, "definitions.gp.nature": 1 }

    const cursor = collection.find(filter, { projection })
    const result = await cursor.toArray()
    //client.close()

    const data = result.map((item) => {
        return {
            id: item._id,
            entry: item.entry,
            variations: item.variations,
            nature: item.definitions['gp'].map(x => x.nature).flat().filter(onlyUnique),
        }
    })

    console.log(JSON.stringify(data, null, 2))

    return 'done.';
}

main()
    .then(console.log)
    .catch(console.error)
    .finally(() => client.close());
