import { BaseDefinition, Meaning, Quote } from "../definition"
import { KreyolLanguage, Nature } from "../types"

export interface SubmitDefinition {
	kreyol: KreyolLanguage
	nature: Nature[]
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
  birthdate: string
}

