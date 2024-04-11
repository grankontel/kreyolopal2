import { KreyolLanguage } from '@kreyolopal/react-ui'

export const apiServer =
  process.env.NEXT_PUBLIC_API_SERVER || 'https://api.kreyolopal.com'
export const cookieName = process.env.NEXT_PUBLIC_COOKIE_NAME || 'wabap'

export type MeaningLanguage = KreyolLanguage | 'fr'

type Definitions = {
  [key in KreyolLanguage]: SingleDefinition[]
} & object

type Meaning = {
  [key in MeaningLanguage]?: string
} & object

export interface SingleDefinition {
  source: string
  definition_id: string
  nature: string[]
  subnature?: string[]
  meaning: Meaning
  usage: string[]
  synonyms: string[]
  confer: string[]
  quotes: string[]
}

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

export type UserDictionaryEntry = {
  cacheMode: 'public' | 'private'
  is_bookmarked: boolean
  entry: DictionaryEntry
  bookmark?: DictionaryEntry
  kreyol: string
}

export class ResponseError extends Error {
  readonly response: Response
  constructor(m: string, r: Response) {
    super(m)

    this.response = r
  }
}

export type User = {
  username: string
  cookie: string
  firstname: string
  lastname: string
  birth_date?: Date
  bearer?: string
}

export interface SpellcheckResponse {
  id: string
  status: string
  kreyol: KreyolLanguage
  unknown_words: string[]
  message: string
  html?: string
}

export interface PersonalDico {
  count: number
  maxPages: number
  entries: DictionaryFullEntry[]
}
