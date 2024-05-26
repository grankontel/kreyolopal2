import { DictionaryFullEntry, SuggestItem } from '@kreyolopal/domain'
import { LRUCache } from 'lru-cache'

export interface DicoCache<T> {
  set: (k: string, v: T) => void
  get: (k: string) => T | undefined
  delete: (k: string) => void
}

const suggestionCache: DicoCache<SuggestItem[]> = new LRUCache<
  string,
  SuggestItem[]
>({
  max: 50,
})

const entryCache = new LRUCache<string, DictionaryFullEntry>({
  max: 50,
})

export default { suggestions: suggestionCache, entries: entryCache }
