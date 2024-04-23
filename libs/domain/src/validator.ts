import { z } from "zod"
import { KreyolLanguages, Natures } from "./types"

const NatureArray: ReadonlyArray<string> = (Object.values(Natures) as Array<string>)
const KreyolArray: ReadonlyArray<string> =(Object.values(KreyolLanguages) as Array<string>)
const LanguageArray: ReadonlyArray<string> = [...(Object.values(KreyolLanguages) as Array<string>), 'fr']


export const SubmitDefinitionSchema = z.object({
  kreyol: z.string().refine((val) =>KreyolArray.includes(val)),
  nature: z.array(z.string()).nonempty().refine((val) => val.every(v => NatureArray.includes(v)), {message: 'Invalid nature provided'}),
  meaning: z.any().refine((val) => Object.keys(val).every(v => LanguageArray.includes(v)), {message: 'Invalid language on meaning'}),
  usage: z.array(z.string()).nonempty(),
  synonyms: z.array(z.string()),
  confer: z.array(z.string())
}).required()

export const SubmitEntrySchema = z.object({
    entry: z.string(),
    variations: z.array(z.string()),
    definitions: z.array(SubmitDefinitionSchema).nonempty(),
  }
).required()

type SubmitEntryType = z.infer<typeof SubmitEntrySchema>; 

export function sanitizeSubmitEntry  (value: object): SubmitEntryType  {
    const src: SubmitEntryType = SubmitEntrySchema.parse(value)

    src.entry = src.entry.trim()
    src.variations = src.variations.map((item) => item.trim().toLowerCase())
    if (!src.variations.includes(src.entry))
      src.variations =  [src.entry, ... src.variations ]

    src.definitions.forEach((definition, index) => {
        src.definitions[index].nature  = definition.nature.map((item) => item.trim().toLowerCase()) as [string, ... string[]]
        src.definitions[index].synonyms  = definition.synonyms.map((item) => item.trim().toLowerCase()) as [string, ... string[]]
        src.definitions[index].confer  = definition.confer.map((item) => item.trim().toLowerCase())
    })

    return src
  }