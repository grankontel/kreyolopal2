import { KreyolLanguage } from '@kreyolopal/domain'

export const dicoUrl = (kreyol: KreyolLanguage, word: string) => {
  return `/dashboard/dictionary/${kreyol}/${encodeURI(word)}`
}
