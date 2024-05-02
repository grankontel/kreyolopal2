import { KreyolLanguage, MeaningLanguage } from './types'

export type RestrictedDefinitionSource = 'reference' | 'validated'

export type DefinitionSource = RestrictedDefinitionSource | 'personal' | 'lexicons'

export type Meaning = {
  [key in MeaningLanguage]?: string
} & object

export interface Quote {
  text: string
  from: string
  author: string
}

export interface BaseDefinition {
  entry: string
  docType: 'definition'
  definition_id: string
  kreyol: KreyolLanguage
  nature: string[]
  subnature?: string[]
  meaning: Meaning
  usage: string[]
  synonyms: string[]
  confer: string[]
  quotes: Quote[]
}

export interface SingleDefinition extends BaseDefinition {
  source: DefinitionSource
}

export type Definitions = {
  [key in KreyolLanguage]: SingleDefinition[]
} & object

export interface BaseEntry {
  entry: string
  docType: 'entry'
  variations: string[]
}

export interface SpecificEntry<T extends BaseDefinition> extends BaseEntry {
  definitions: T[]
}

export interface DictionaryBaseEntry extends BaseEntry {
  _id: string
}

export interface DictionaryEntry {
  entry: string
  variations: string[]
  definitions: Array<SingleDefinition>
}

export interface DictionaryFullEntry {
  id: string
  entry: string
  variations: string[]
  definitions: Definitions
}
