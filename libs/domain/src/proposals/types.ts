import { DictionaryDefinition, Quote, SpecificEntry } from "../definition"
import { KreyolLanguage, Meaning, Nature } from "../types"

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
