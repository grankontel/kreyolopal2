
export const postSpellCheck = async (token:string, text:string ) => {
  const word = text.trim()
  if (word.length === 0) return Promise.resolve([])

  const query = {
    kreyol: 'GP',
    request: word,
  }

	const myHeaders = new Headers()
	myHeaders.set('Content-Type', 'application/json')

	if (token) myHeaders.set('Authorization', `Bearer ${token}`)

  return fetch(`/api/spellcheck`, {
    method: 'POST',
//    credentials: 'same-origin',
    headers: myHeaders,
    body: JSON.stringify(query),
  })
    .then(
      async (result) => {
        if (!result.ok) {
          return []
        }

        return result.json()
      },
      (reason) => {
        console.log(reason)
        return []
      }
    )
    .catch((er) => {
      console.log(er)
      return []
    })
}

export async function postRateCorrection(token: string, msgId: string, rating:{rating: number}) {
  console.log('postRateCorrection')

	const myHeaders = new Headers()
	myHeaders.set('Content-Type', 'application/json')

	if (token) myHeaders.set('Authorization', `Bearer ${token}`)

  return fetch(`/api/spellcheck/${msgId}/rating`, {
    method: 'POST',
    headers: myHeaders,
    body: JSON.stringify(rating),
  })
    .then(
      async (result) => {
        if (!result.ok) {
          return []
        }

        return result.json()
      },
      (reason) => {
        console.log(reason)
        return []
      }
    )
    .catch((er) => {
      console.log(er)
      return []
    })
}
