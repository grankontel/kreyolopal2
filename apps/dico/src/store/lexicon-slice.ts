import { StateCreator } from 'zustand'
import { LexiconSlice, DicoStore } from './types'
import { Lexicon } from '@/lib/lexicons/types'

export const createLexiconSlice: StateCreator<DicoStore, [], [], LexiconSlice> = (
  set
) => ({
  lexicons: [],
  setLexicons: (data: Lexicon[]) => {
    set(() => ({ lexicons: data }))
  },
})
