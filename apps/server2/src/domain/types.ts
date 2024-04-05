export const KreyolLanguages = {
	gp: 'gp',
	mq: 'mq',
	ht: 'ht'
} as const;

export type KreyolLanguage = (typeof KreyolLanguages)[keyof typeof KreyolLanguages]

export type MeaningLanguage = KreyolLanguage | 'fr'

export type RestrictedDefinitionSource = 'reference' | 'validated'
export type DefinitionSource = RestrictedDefinitionSource | 'personal'

type Meaning = {
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
	docType: "definition"
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

export interface DictionaryEntry {
	_id: string
	entry: string
	docType: "entry"
	variations: string[]
	definitions: Array<SingleDefinition>
}

export interface LexiconEntry {
  _id: string
  entry: string
  variations: string[]
  def_ids: string[]
  lexicons: string[]
}
