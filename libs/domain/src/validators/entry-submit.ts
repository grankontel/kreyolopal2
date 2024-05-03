import { z } from 'zod'
import { KreyolLanguage, KreyolLanguages, Natures } from '#src/types'

const NatureArray: ReadonlyArray<string> = Object.values(Natures) as Array<string>
const KreyolArray: ReadonlyArray<string> = Object.values(KreyolLanguages) as Array<string>
const LanguageArray: ReadonlyArray<string> = [
  ...(Object.values(KreyolLanguages) as Array<string>),
  'fr',
]

export const SubmitDefinitionSchema = z
  .object({
    kreyol: z.string().refine((val) => KreyolArray.includes(val)),
    nature: z
      .array(z.string())
      .nonempty()
      .refine((val) => val.every((v) => NatureArray.includes(v)), {
        message: 'Invalid nature provided',
      }),
    meaning: z
      .object({})
      .catchall(z.any())
      .refine((val) => Object.keys(val).every((v) => LanguageArray.includes(v)), {
        message: 'Invalid language on meaning',
      }),
    usage: z.array(z.string()).nonempty(),
    synonyms: z.array(z.string()),
    confer: z.array(z.string()),
    quotes: z.optional(
      z.array(
        z
          .object({
            text: z.string().min(1),
            from: z.string().min(1),
            author: z.string().min(1),
          })
          .required()
      )
    ),
  })
  .required()

export const SubmitEntrySchema = z
  .object({
    entry: z.string().min(1),
    variations: z.array(z.string()),
    definitions: z.array(SubmitDefinitionSchema).nonempty(),
  })
  .required()

export type SubmitEntryType = z.infer<typeof SubmitEntrySchema>

export function sanitizeSubmitEntry(value: any) {
  const src = { ...SubmitEntrySchema.parse(value) }

  src.entry = src.entry.trim()
  src.variations = src.variations.map((item) => item.trim().toLowerCase())
  if (!src.variations.includes(src.entry)) src.variations = [src.entry, ...src.variations]

  src.definitions.forEach((definition, index) => {
    src.definitions[index].kreyol = src.definitions[index].kreyol as KreyolLanguage
    src.definitions[index].nature = definition.nature.map((item) =>
      item.trim().toLowerCase()
    ) as [string, ...string[]]
    src.definitions[index].synonyms = definition.synonyms.map((item) =>
      item.trim().toLowerCase()
    ) as [string, ...string[]]
    src.definitions[index].confer = definition.confer.map((item) =>
      item.trim().toLowerCase()
    )
  })

  return src
}
