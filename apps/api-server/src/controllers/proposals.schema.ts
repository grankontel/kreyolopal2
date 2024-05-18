import { z } from 'zod'

export const paramGetWordSchema = z
  .object({
    language: z.enum(['gp', 'mq', 'GP', 'MQ']),
    word: z.string(),
  })
  .required()

export const paramVoteSchema = z
  .object({
    entry: z.string().min(1),
    definition_id: z.string().min(1),
  })
  .required()

export const postValiddateSchema = z
  .object({
    variations: z.array(z.string()),
    definitions: z.array(z.string().min(1)).nonempty(),
  })
  .required()

