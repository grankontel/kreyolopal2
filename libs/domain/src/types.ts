export const KreyolLanguages = {
  gp: 'gp',
  mq: 'mq',
  ht: 'ht'
} as const;

export type KreyolLanguage = (typeof KreyolLanguages)[keyof typeof KreyolLanguages]

export type MeaningLanguage = KreyolLanguage | 'fr'

export const MongoCollection = {
  reference: 'reference',
  validated: 'validated',
  personal: 'personal',
  lexicons: 'lexicons',
} as const;

