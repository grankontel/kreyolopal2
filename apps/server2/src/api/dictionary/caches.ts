import { LRUCache } from 'lru-cache'
import { DictionaryEntry } from '../../domain/types'

interface WordSuggestion {
  entry: string
  docType: 'entry'
  variations: string[]
}

export interface DicoCache<T> {
	set: (k: string,v: T) => void
	get: (k:string) => T | undefined
	delete: (k:string) => void
}

const suggestionCache: DicoCache<WordSuggestion[]> = new LRUCache<string, WordSuggestion[]>({
  max: 50,
})

const entryCache = new LRUCache<string, DictionaryEntry>({
  max: 50,
})

export default {suggestions: suggestionCache, entries: entryCache}
