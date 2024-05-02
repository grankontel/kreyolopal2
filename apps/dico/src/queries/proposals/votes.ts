import { ResponseError } from '@/lib/types'

export async function getVotes(token: string, entry: string, definitionId: string) {
  console.log('getVotes')

  const myHeaders = new Headers()
  myHeaders.set('Content-Type', 'application/json')
  myHeaders.set('Accept', 'application/json')

  if (token) myHeaders.set('Authorization', `Bearer ${token}`)

  return fetch(`/api/proposals/votes/${entry}/${definitionId}`, {
    method: 'GET',
    headers: myHeaders,
  }).then(async (result) => {
    if (!result.ok) throw new ResponseError('Failed to propose new definition', result)

    return result.json()
  })
}

export async function upVote(token: string, entry: string, definitionId: string): Promise<{message:string}>{
  console.log('upVote')

  const myHeaders = new Headers()
  myHeaders.set('Content-Type', 'application/json')
  myHeaders.set('Accept', 'application/json')

  if (token) myHeaders.set('Authorization', `Bearer ${token}`)

  return fetch(`/api/proposals/votes/${entry}/${definitionId}/up`, {
    method: 'GET',
    headers: myHeaders,
  }).then(async (result) => {
    if (!result.ok) throw new ResponseError('Failed to propose new definition', result)

    return result.json<{message:string}>()
  })
}

export async function downVote(token: string, entry: string, definitionId: string): Promise<{message:string}> {
  console.log('downVote')

  const myHeaders = new Headers()
  myHeaders.set('Content-Type', 'application/json')
  myHeaders.set('Accept', 'application/json')

  if (token) myHeaders.set('Authorization', `Bearer ${token}`)

  return fetch(`/api/proposals/votes/${entry}/${definitionId}/down`, {
    method: 'GET',
    headers: myHeaders,
  }).then(async (result) => {
    if (!result.ok) throw new ResponseError('Failed to propose new definition', result)

    return result.json<{message:string}>()
  })
}
