import { DictionaryFullEntry, ResponseError } from "@/lib/types"

const apiServer = process.env.NEXT_PUBLIC_API_SERVER || 'https://api.kreyolopal.com'

interface PersonalDico {
	count: number;
	maxPages: number;
	data: DictionaryFullEntry[]
}

export const fetchPersonalDico = ({ token, page = 0 }: { token: string, page: number }) =>
	new Promise<PersonalDico>(async (resolve, reject) => {
		const PAGE_SIZE = 20
		const [offset, limit] = [page * PAGE_SIZE, PAGE_SIZE]

		const fetchHeaders = new Headers()
		fetchHeaders.set('Content-Type', 'application/json',)
		fetchHeaders.set('Authorization', `Bearer ${token}`)

		const result = (await fetch(
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
		})) as Response

		if (!result.ok) {
			reject(new ResponseError('could not fetch data', result))
		}
		const total = parseInt(result.headers.get('X-Total-Count') || '0')
		const data = await result.json<DictionaryFullEntry[]>()
		const maxPages = Math.ceil(total / PAGE_SIZE)
		resolve({ count: total, maxPages, data })
	})

	