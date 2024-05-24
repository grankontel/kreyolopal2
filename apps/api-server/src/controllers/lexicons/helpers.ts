import config from "#config"
import { createHttpException } from "#utils/apiHelpers"
import { MongoCollection } from "@kreyolopal/domain"
import type { MongoClient } from "mongodb"

export interface LexiconEntry {
  _id?: string
  entry: string
  docType: string
  variations: string[]
  def_ids: string[]
  lexicons: string[]
}

export function getEntry(
  client: MongoClient,
  lexicon_id: string,
  kreyol: string,
  aWord: string
): Promise<LexiconEntry> {
  const agg = [
    {
      $match: {
        entry: aWord,
        lexicons: lexicon_id,
      },
    },
    {
      $lookup: {
        from: 'reference',
        let: {
          defi: '$def_ids',
        },
        pipeline: [
          {
            $match: {
              docType: 'definition',
              kreyol: kreyol,
              $expr: {
                $in: ['$definition_id', '$$defi'],
              },
            },
          },
        ],
        as: 'ref_definitions',
      },
    },
    {
      $lookup: {
        from: 'validated',
        let: {
          defi: '$def_ids',
        },
        pipeline: [
          {
            $match: {
              docType: 'definition',
              kreyol: kreyol,
              $expr: {
                $in: ['$definition_id', '$$defi'],
              },
            },
          },
        ],
        as: 'val_definitions',
      },
    },
    {
      $project: {
        id: '$_id',
        _id: 0,
        entry: 1,
        variations: 1,
        definitions: {
          $concatArrays: ['$ref_definitions', '$val_definitions'],
        },
      },
    },
  ]
  return new Promise<LexiconEntry>((resolve, reject) => {
    const coll = client
      .db(config.mongodb.database)
      .collection(MongoCollection.lexicons)
    const cursor = coll.aggregate<LexiconEntry>(agg)
    cursor.toArray().then((result) => {
      cursor.close()
      if (result.length === 0)
        reject(createHttpException({ error: 'Not Found' }, 404, 'Not Found'))

      resolve(result[0])
    })
  })
}

export const buildListAggregate = (lexiconId: string, skip: number, limit: number) => [
  {
    $match: {
      lexicons: lexiconId,
    },
  },
  {
    $skip: skip,
  },
  {
    $limit: limit,
  },
  {
    $lookup: {
      from: 'reference',
      let: {
        defi: '$def_ids',
      },
      pipeline: [
        {
          $match: {
            docType: 'definition',
            $expr: {
              $in: ['$definition_id', '$$defi'],
            },
          },
        },
      ],
      as: 'ref_definitions',
    },
  },
  {
    $lookup: {
      from: 'validated',
      let: {
        defi: '$def_ids',
      },
      pipeline: [
        {
          $match: {
            docType: 'definition',
            $expr: {
              $in: ['$definition_id', '$$defi'],
            },
          },
        },
      ],
      as: 'val_definitions',
    },
  },
  {
    $project: {
      entry: 1,
      variations: 1,
      definitions: {
        $concatArrays: ['$ref_definitions', '$val_definitions'],
      },
    },
  },
]