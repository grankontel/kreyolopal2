import { BaseDefinition, BaseEntry, Meaning, Quote, SpecificEntry } from '../definition'
import { KreyolLanguage, Nature } from '../types'

export interface SubmitDefinition {
  kreyol: KreyolLanguage | string
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

export interface ProposalDefinition extends BaseDefinition {
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