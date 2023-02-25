import mongoose from "mongoose"

  // const client = new MongoClient(config.mongodb.uri, {
  //   useNewUrlParser: true,
  //   useUnifiedTopology: true,
  // })

  // await client.connect()

export const getClient =  () => {
  const connection = mongoose.connection
  const mongo = connection.getClient()

  return mongo
}

