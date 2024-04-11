import { KreyolLanguage } from '@kreyolopal/react-ui'

export const dicoUrl = (kreyol: KreyolLanguage, word: string) => {
	return (`/dashboard/dictionary/${kreyol}/${encodeURI(word)}`)
}
