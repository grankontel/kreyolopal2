import { Entry } from '@/components/entry'
import { DictionaryEntry } from '@/lib/types'

export const runtime = 'edge'

const word: DictionaryEntry[] = [
  {
    id: '6424474037c80d2e57e2390b',
    entry: 'chat',
    variations: ['chat'],
    definitions: [
      {
        nature: ['nom'],
        meaning: {
          gp: '',
          fr: 'chat, chatte.',
        },
        usage: ['makou-chat a vwazin an-mwen toujou ochan dèyè fimèl-chat an-mwen la,'],
        synonyms: [],
        confer: [],
        quotes: [],
      },
      {
        nature: ['nom'],
        meaning: {
          gp: '',
          fr: 'sexe de la petit fille.',
        },
        usage: ['pa lésé tifi-la toutouni èvè chat a-y dèwò konsa.'],
        synonyms: [],
        confer: [],
        quotes: [],
      },
      {
        nature: ['nom'],
        meaning: {
          gp: '',
          fr: 'biceps.',
        },
        usage: ['fè chat a-w monté pou fè vwè si ou ni fòs.'],
        synonyms: [],
        confer: [],
        quotes: [],
      },
    ],
  },
]
export default function Page({ params }: { params: { kreyol: string; entry: string } }) {
  return (
    <Entry
      kreyol={params.kreyol}
      word={word[0]}
      dicoUrl={(w) => `/dashboard/dictionary/${params.kreyol}/${encodeURI(w)}`}
    />
  )
}
