// consts

export const KreyolLanguages = {
  gp: 'gp',
  mq: 'mq',
  ht: 'ht',
  dm: 'dm',
} as const

export const MongoCollection = {
  reference: 'reference',
  validated: 'validated',
  personal: 'personal',
  lexicons: 'lexicons',
  proposals: 'proposals',
} as const

export const Natures = {
  adjectif: 'adjectif',
  adverbe: 'adverbe',
  article: 'article',
  conjonction: 'conjonction',
  exclamation: 'exclamation',
  expression: 'expression',
  interjection: 'interjection',
  locution: 'locution',
  nom: 'nom',
  nom_propre: 'nom propre',
  nombre: 'nombre',
  particule: 'particule',
  préfixe: 'préfixe',
  préposition: 'préposition',
  pronom: 'pronom',
  suffixe: 'suffixe',
  verbe: 'verbe',
} as const

export const LanguageArray: ReadonlyArray<MeaningLanguage> = [
  ...(Object.values(KreyolLanguages) as Array<KreyolLanguage>),
  'fr',
]

// types

export type KreyolLanguage = (typeof KreyolLanguages)[keyof typeof KreyolLanguages]

export type MeaningLanguage = KreyolLanguage | 'fr'

export type Meaning = {
  [key in MeaningLanguage]?: string
} & object

export type Nature = (typeof Natures)[keyof typeof Natures]

// interfaces

export interface BaseEntry {
  entry: string
  docType: 'entry'
  variations: string[]
}

export interface SpecificEntry<T extends DictionaryDefinition> extends BaseEntry {
  definitions: T[]
}

export interface DictionaryEntry extends BaseEntry {
  aliasOf?: string
}

export interface Quote {
  text: string
  from: string
  author: string
}

export interface DictionaryDefinition {
  entry: string
  docType: 'definition'
  prefix?: string
  suffix?: string
  asIn?: string
  definition_id: string
  kreyol: KreyolLanguage
  rank: number
  nature: string[]
  subnature?: string[]
  meaning: Meaning
  usage: string[]
  synonyms: string[]
  confer: string[]
  quotes: Quote[]
}

// interfaces for proposal

export interface SubmitDefinition {
  kreyol: KreyolLanguage | string
  prefix?: string
  suffix?: string
  asIn?: string
  nature: Nature[] | string[]
  meaning: Meaning
  usage: string[]
  synonyms: string[]
  confer: string[]
  quotes: Quote[]
}

export interface SubmitEntry {
  entry: string
  variations: string[]
  definitions: Array<SubmitDefinition>
}

export interface SubmitEntryAlias {
  entry: string
  aliasOf: string
}

export interface ProposalDefinition extends DictionaryDefinition {
  creator: string
  rank: number
  upvoters: Backer[]
  downvoters: Backer[]
}

export interface Backer {
  user: string
  birthdate: Date
}

export interface ProposalEntry extends SpecificEntry<ProposalDefinition> {}

// lexicon

export interface Lexicon {
  id: string
  owner: string
  name: string
  slug: string
  path: string
  description: string
  is_private: boolean
}

// profile, see: https://demos.creative-tim.com/material-dashboard-pro/pages/pages/profile/overview.html
// see: https://v0.dev/t/Nuh6918wEJd
