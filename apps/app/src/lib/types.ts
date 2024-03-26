import { KreyolLanguage } from '@kreyolopal/react-ui'

export type MeaningLanguage = KreyolLanguage | 'fr'

type Definitions = {
  [key in KreyolLanguage]: SingleDefinition[]
} & object

type Meaning = {
  [key in MeaningLanguage]?: string
} & object

export interface SingleDefinition {
  nature: string[]
  subnature?: string[]
  meaning: Meaning
  usage: string[]
  synonyms: string[]
  confer: string[]
  quotes: string[]
}

export interface DictionaryEntry {
  id: string
  entry: string
  variations: string[]
  definitions: Array<SingleDefinition>
}

export class ResponseError extends Error {
  readonly response: Response
  constructor(m: string, r: Response) {
    super(m)

    this.response = r
  }
}

export type User = {
	cookie: string;
	firstname: string;
	lastname: string;
  bearer?: string;
}
