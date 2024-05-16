import { ResponseError } from '@/lib/types'
import { ProposalDefinition, SubmitEntry } from '@kreyolopal/domain'

export async function postProposal(token: string, entry: SubmitEntry) {
  console.log('postProposal')

  const myHeaders = new Headers()
  myHeaders.set('Content-Type', 'application/json')
  myHeaders.set('Accept', 'application/json')

  if (token) myHeaders.set('Authorization', `Bearer ${token}`)

  return fetch(`/api/proposals`, {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(entry),
  }).then(async (result) => {
    if (!result.ok) throw new ResponseError('Failed to propose new definition', result)

    return result.json<ProposalDefinition>()
  })
}
