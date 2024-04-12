import { DictionaryFullEntry, ResponseError, apiServer, PaginatedDico } from '@/lib/types'

interface LexiconEntriesProps {
	token: string;
	username: string
	slug: string
	page: number
}

export const fetchLexiconEntries = ({ token, username, slug, page = 0 }: LexiconEntriesProps) =>
	new Promise<PaginatedDico>(async (resolve, reject) => {
		const PAGE_SIZE = 20
		const [offset, limit] = [page * PAGE_SIZE, PAGE_SIZE]

		const fetchHeaders = new Headers()
		fetchHeaders.set('Content-Type', 'application/json')
		fetchHeaders.set('Authorization', `Bearer ${token}`)

		const result = (await fetch(
			`${apiServer}/api/lexicons/${username}/${slug}/entries?offset=${offset}&limit=${limit}`,
			{
				method: 'GET',
				//      credentials: 'same-origin',
				headers: fetchHeaders,
				next: { revalidate: 3600 },
			}
		).catch(function (error) {
			console.log("Il y a eu un problème avec l'opération fetch : " + error.message)
			reject(error)
		})) as Response

		if (!result.ok) {
			reject(new ResponseError('could not fetch data', result))
		}
		const total = parseInt(result.headers.get('X-Total-Count') || '0')
		const data = await result.json<DictionaryFullEntry[]>()
		const maxPages = Math.ceil(total / PAGE_SIZE)
		resolve({ count: total, maxPages, entries: data })
	})
