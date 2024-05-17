import { DefinitionSource, KreyolLanguage, Meaning } from "./types"

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

export interface SingleDefinition extends DictionaryDefinition {
  source: DefinitionSource
}

export interface DictionaryFullEntry {
  entry: string
  variations: string[]
  definitions: Array<SingleDefinition>
}
