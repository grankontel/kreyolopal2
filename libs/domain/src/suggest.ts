import { RestrictedDefinitionSource } from "./types"

export interface SuggestItem {
  entry: string
	source: RestrictedDefinitionSource
  aliasOf?: string
}
