import {
  KreyolLanguage,
  BaseDefinition,
  DictionaryEntry,
  DictionaryFullEntry,
  ProposalEntry,
  BaseEntry,
} from '@kreyolopal/domain'

export const apiServer =
  process.env.NEXT_PUBLIC_API_SERVER || 'https://api.kreyolopal.com'
export const cookieName = process.env.NEXT_PUBLIC_COOKIE_NAME || 'wabap'

export interface UserEntry<U extends BaseEntry> {
  entry: U
  kreyol: string
}
export interface UserDictionaryEntry  {
  entry: DictionaryEntry
  kreyol: string
  cacheMode: 'public' | 'private'
  is_bookmarked: boolean
  bookmark?: DictionaryEntry
}

export interface UserProposalEntry extends UserEntry<ProposalEntry> {}

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

export interface PaginatedDico {
  count: number
  maxPages: number
  entries: DictionaryFullEntry[]
}
