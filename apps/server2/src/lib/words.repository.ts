import type { Context } from 'hono'
import winston from 'winston'
import { MongoClient } from 'mongodb'
import config from '#config'
import {
  BaseDefinition,
  DictionaryBaseEntry,
  DictionaryEntry,
  KreyolLanguage,
  MongoCollection,
  SingleDefinition,
} from '@kreyolopal/domain'

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

  public async Exists(
    word: string
  ): Promise<'reference' | 'validated' | false> {
    const refCol = WordsRepository.client
      .db(config.mongodb.db)
      .collection(MongoCollection.reference)

    const inReference = await refCol
      .countDocuments({
        entry: word,
      })
      .then((val) => {
        WordsRepository.logger.debug(val)
        return val != 0
      })

    if (inReference) return 'reference'

    const refVal = WordsRepository.client
      .db(config.mongodb.db)
      .collection(MongoCollection.validated)

    const inValidated = await refVal
      .countDocuments({
        entry: word,
      })
      .then((val) => {
        WordsRepository.logger.debug(val)
        return val != 0
      })

    if (inValidated) return 'validated'

    return false
  }

  public async GetReference(
    aWord: string,
    lang: KreyolLanguage
  ): Promise<DictionaryEntry | null> {
    return new Promise<DictionaryEntry | null>(async (resolve, reject) => {
      WordsRepository.logger.info(`WordsRepository.GetReference ${aWord}`)
      const client = WordsRepository.client
      const filter = {
        $and: [
          {
            entry: aWord,
          },
          {
            $or: [
              {
                docType: 'entry',
              },
              {
                docType: 'definition',
                kreyol: lang,
              },
            ],
          },
        ],
      }
      const projection = {
        _id: 0,
      }

      try {
        const coll = client
          .db(config.mongodb.db)
          .collection(MongoCollection.reference)
        const cursor = coll.find<BaseDefinition | DictionaryBaseEntry>(filter)
        const result = await cursor.toArray()
        cursor.close()
        if (result.length === 0) {
          resolve(null)
        }

        const entry = result.filter((item) => item.docType == 'entry')[0]
        const basedefs: BaseDefinition[] = result.filter(
          (item) => item.docType == 'definition'
        ) as BaseDefinition[]
        const defs: SingleDefinition[] = basedefs.map((item) => {
          const { _id, ...rest } = item
          return { source: MongoCollection.reference, ...rest }
        })

        const data: DictionaryEntry = { ...entry, definitions: defs }
        resolve(data)
      } catch (e: any) {
        reject(e)
      }
    })
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
      cursor.close()
      //client.close()

      const data = result?.map(mapCallback)
      WordsRepository.logger.info(
        `WordsRepository.GetOne: ${data.length} results`
      )

      return data
    } catch (e: any) {
      WordsRepository.logger.error(e.message)
      throw new Error(e.message)
    }
  }
}
