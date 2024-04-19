import { KreyolLanguage, MeaningLanguage } from "./types"

export type RestrictedDefinitionSource =  "reference" | "validated"

export type DefinitionSource = RestrictedDefinitionSource | "personal" | "lexicons"

export type Meaning = {
  [key in MeaningLanguage]?: string
} & object

export interface Quote {
  text: string
  from: string
  author: string
}


export interface SingleDefinition {
  source: DefinitionSource
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

export type Definitions = {
  [key in KreyolLanguage]: SingleDefinition[]
} & object

export interface DictionaryEntry {
  _id: string
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
