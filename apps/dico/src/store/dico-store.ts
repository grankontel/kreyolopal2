import { create } from 'zustand'
import { DicoStore } from './types'
import { createDicoSlice } from './dico-slice'
import { createUserSlice } from './user-slice'
import { createLexiconSlice } from './lexicon-slice'

export const useDicoStore = create<DicoStore>()((...a) => ({
  ...createDicoSlice(...a),
  ...createUserSlice(...a),
  ...createLexiconSlice(...a),
}))
