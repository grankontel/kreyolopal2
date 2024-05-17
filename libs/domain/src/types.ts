import { KreyolLanguages, Natures } from "./consts"

export type KreyolLanguage = (typeof KreyolLanguages)[keyof typeof KreyolLanguages]

export type MeaningLanguage = KreyolLanguage | 'fr'

export type Meaning = {
  [key in MeaningLanguage]?: string
} & object

export type Nature = (typeof Natures)[keyof typeof Natures]

export const LanguageArray: ReadonlyArray<MeaningLanguage> = [
  ...(Object.values(KreyolLanguages) as Array<KreyolLanguage>),
  'fr',
]

export type RestrictedDefinitionSource = 'reference' | 'validated'

export type DefinitionSource = RestrictedDefinitionSource | 'personal' | 'lexicons'
