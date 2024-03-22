const apiServer = process.env.NEXT_PUBLIC_API_SERVER || 'https://api.kreyolopal.com'

export const fetchPersonalDico = ({ auth, page = 0 }) =>
  new Promise(async (resolve, reject) => {
    const PAGE_SIZE = 20
    const [offset, limit] = [page * PAGE_SIZE, PAGE_SIZE]
    const { user_id, session_id } = auth || { user_id: null, session_id: null }

    const fetchHeaders = {
      'Content-Type': 'application/json',
    }
    if (user_id != null) 
      fetchHeaders['Authorization'] = `Bearer ${session_id}`

    const result = await fetch(
      `${apiServer}/api/me/dictionary?offset=${offset}&limit=${limit}`,
      {
        method: 'GET',
        //      credentials: 'same-origin',
        headers: fetchHeaders,
        next: { revalidate: 3600 },
      }
    ).catch(function (error) {
      console.log("Il y a eu un problème avec l'opération fetch : " + error.message)
      reject(error)
    })

    if (!result.ok) {
      reject(new Error('could not fetch data', { response: result }))
    }
    const total = result.headers.get('X-Total-Count')
    const data = await result.json()
    const maxPages = Math.ceil(total / PAGE_SIZE)
    resolve({ count: parseInt(total), maxPages, data })
  })
