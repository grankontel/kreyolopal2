import { Meaning, Quote } from "../definition"
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

export interface ProposalDefinition extends SubmitDefinition {
	upvoters: [
		{
			user: string,
			birthdate: Date
		}
	],
	downvoters: [
		{
			user: string,
			birthdate: Date
		}
	]
}

export interface ProposalEntry extends SubmitEntry {
	creator: string,
	rank: number,
}