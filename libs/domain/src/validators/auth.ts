import { z } from 'zod'

export const signupSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3)
      .max(31)
      .regex(/^[a-z0-9_-]+$/, 'invalid username'),
    password: z.string().trim().min(8).max(200),
    firstname: z.string().trim().min(2),
    lastname: z.string().trim().min(2),
    email: z.string().email(),
  })
  .required()

  export const loginSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3)
      .max(31)
      .regex(/^[a-z0-9_-]+$/),
    password: z.string().trim().min(8).max(200),
  })
  .required()

  