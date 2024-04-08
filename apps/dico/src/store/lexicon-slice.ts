import { StateCreator } from 'zustand'
import { LexiconSlice, DicoStore } from './types'
import { Lexicon } from '@/lib/lexicons/types'
import { DashboardMenuItem } from '@/lib/dashboard'
import { useDicoStore } from './dico-store'

export const createLexiconSlice: StateCreator<DicoStore, [], [], LexiconSlice> = (
  set
) => ({
  lexicons: [],
  setLexicons: (data: Lexicon[]) => {
    set(() => ({ lexicons: data }))
  },
})
