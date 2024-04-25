export const KreyolLanguages = {
  gp: 'gp',
  mq: 'mq',
  ht: 'ht',
  dm: 'dm'
} as const;


export type KreyolLanguage = (typeof KreyolLanguages)[keyof typeof KreyolLanguages]

export type MeaningLanguage = KreyolLanguage | 'fr'

export const LanguageArray: ReadonlyArray<MeaningLanguage> = [...(Object.values(KreyolLanguages) as Array<KreyolLanguage>), 'fr']

export const MongoCollection = {
  reference: 'reference',
  validated: 'validated',
  personal: 'personal',
  lexicons: 'lexicons',
  proposals: 'proposals',
} as const;

export const Natures = {
  adjectif: "adjectif",
  adverbe: "adverbe",
  article: "article",
  conjonction: "conjonction",
  exclamation: "exclamation",
  expression: "expression",
  interjection: "interjection",
  locution: "locution",
  nom: "nom",
  nom_propre: "nom propre",
  nombre: "nombre",
  particule: "particule",
  préfixe: "préfixe",
  préposition: "préposition",
  pronom: "pronom",
  suffixe: "suffixe",
  verbe: "verbe"
} as const

export type Nature = (typeof Natures)[keyof typeof Natures]