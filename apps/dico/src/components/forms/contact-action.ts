'use server'

import { z } from 'zod'
import { ActionState } from './contact-state'
// export const runtime = 'edge'

const apiServer = process.env.NEXT_PUBLIC_API_SERVER || 'https://api.kreyolopal.com'
const turnstileSecretKey = process.env.TURNSTILE_SECRETKEY || ''
const verifyEndpoint = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

const postContactSchema = z
  .object({
    'cf-turnstile-response': z.string().min(1),
    firstname: z.string().min(1),
    lastname: z.string().min(1),
    email: z.string().email(),
    subject: z.string().min(1),
    message: z.string().min(1),
  })
  .required()

interface SiteVerifyResponse {
  success: boolean
  'error-codes': string[]
}

export default async function postContact(
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> {
  const endpoint = apiServer + '/api/contact'
  const body = Object.fromEntries(formData.entries())
  const validatedFields = postContactSchema.safeParse(body)

  console.log('here')
  console.log({ prevState, turnstileSecretKey })
  // Return early if the form data is invalid
  if (!validatedFields.success) {
    return Promise.resolve({
      status: 'error',
      errors: Object.entries(validatedFields.error.flatten().fieldErrors),
    })
  }

  const token = body['cf-turnstile-response'] as string
  delete body['cf-turnstile-response']

  const result = await fetch(verifyEndpoint, {
    method: 'POST',
    body: `secret=${encodeURIComponent(turnstileSecretKey)}&response=${encodeURIComponent(token)}`,
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      Accept: 'application/json',
    },
  })

  const data = await result.json<SiteVerifyResponse>()
  if (!data.success) {
    console.log(data)
    return {
      status: 'error',
      errors: ['invalid token'],
    }
  }

  return fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(body),
  }).then((response) => {
    if (!response.ok) {
      console.log('not ok')
      return {
        status: 'error',
        errors: [response.statusText],
      }
    }
    return response.json()
  })
}
