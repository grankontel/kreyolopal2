import { Context } from 'hono'
import winston from 'winston'
import { MongoClient } from 'mongodb'
import config from '#config'

export class WordsRepository {
  private static instance: WordsRepository
  private static logger: winston.Logger
  private static client: MongoClient
  private constructor() {}

  public static getInstance(c: Context): WordsRepository {
    if (!WordsRepository.instance) {
      WordsRepository.instance = new WordsRepository()
      WordsRepository.logger = c.get('logger')
      WordsRepository.client = c.get('mongodb')
    }

    return WordsRepository.instance
  }

  public async GetOne(word: string, mapCallback) {
    WordsRepository.logger.info(`WordsRepository.GetOne ${word}`)
    try {
      const filter = {
        entry: word,
      }
      const projection = {
        entry: 1,
        variations: 1,
        definitions: 1,
      }

      // const client = getClient()
      const coll = WordsRepository.client
        .db(config.mongodb.db)
        .collection('words')
      const cursor = coll.find(filter, { projection })
      const result = await cursor.toArray()

      //client.close()

      const data = result?.map(mapCallback)
      WordsRepository.logger.info(`WordsRepository.GetOne: ${data.length} results`)
 
      return data
    } catch (e) {
      WordsRepository.logger.error(e.message)
      throw new Error(e.message)
    }
  }
}
