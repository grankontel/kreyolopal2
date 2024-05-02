import { ResponseError } from '@/lib/types'

interface ValidateProposalPayload {
	entry: string
	definitions: string[]
	variations: string[]

}

export async function validateProposal(token: string, payload: ValidateProposalPayload) {
  console.log('validateProposal')

  const myHeaders = new Headers()
  myHeaders.set('Content-Type', 'application/json')
  myHeaders.set('Accept', 'application/json')

  if (token) myHeaders.set('Authorization', `Bearer ${token}`)

  return fetch(`/api/proposals/validate/${payload.entry}`, {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify({
			definitions:payload.definitions,
			variations: payload.variations,
		}),
  }).then(async (result) => {
    if (!result.ok) throw new ResponseError(`Failed to validate definitions for ${payload.entry} `, result)

    return result.json()
  })
}
