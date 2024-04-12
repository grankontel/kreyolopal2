import { SingleDefinition } from "@kreyolopal/domain"

export interface DictionaryEntry {
  _id: string
  entry: string
  docType: 'entry'
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
