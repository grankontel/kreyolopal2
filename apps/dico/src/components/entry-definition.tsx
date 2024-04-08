import Link from 'next/link'
import { MeaningLanguage, SingleDefinition } from '@/lib/types'
import { hashKey } from '@/lib/utils'

export const EntryDefinition = ({
  entry,
  index,
  definition,
  dicoUrl,
}: {
  entry: string
  index: number
  definition: SingleDefinition
  dicoUrl: (word: string) => string
}) => {
  const nature = definition.nature.join(', ')
  const subnature = definition.subnature?.length
    ? definition.subnature.join(', ')
    : nature
  const def_langues = Object.keys(definition.meaning).filter((value) => value !== 'fr')

  return (
    <section className="definition py-4 border-b-gray-200 border-b-2 dark:bg-inherit dark:border-b-gray-700">
      <div className="grid gap-2">
        <p className="nature text-md text-gray-400 dark:text-gray-600">
          <span className="font-medium">
            {index}. {subnature}{' '}
          </span>
        </p>
        <section className="mb-3">
          {def_langues.map((lang) => {
            const k = lang as MeaningLanguage
            return definition.meaning[k]?.length === 0 ? (
              ''
            ) : (
              <div className="meaning text-xl text-gray-600 dark:text-gray-500 mb-3">
                <p>
                  [{lang}] {definition.meaning[k]}
                </p>
              </div>
            )
          })}

          {definition.meaning['fr']?.length === 0 ? (
            ' '
          ) : (
            <div className="meaning font-light text-xl text-gray-500 dark:text-gray-400 mb-3">
              <p>[fr] {definition.meaning['fr']}</p>
            </div>
          )}
        </section>

        {definition.synonyms.length === 0 ? (
          ' '
        ) : (
          <Synonyms entry={entry} list={definition.synonyms} dicoUrl={dicoUrl} />
        )}

        {definition.confer.length === 0 ? (
          ' '
        ) : (
          <Confers entry={entry} list={definition.confer} dicoUrl={dicoUrl} />
        )}

        {definition.usage.length === 0 ? (
          ' '
        ) : (
          <Usages entry={entry} list={definition.usage} dicoUrl={dicoUrl} />
        )}
      </div>
    </section>
  )
}

const Synonyms = ({
  entry,
  list,
  dicoUrl,
}: {
  entry: string
  list: string[]
  dicoUrl: (word: string) => string
}) => (
  <section className="grid gap-2 mb-2">
    <h2 className="text-lg font-bold">Synonymes</h2>
    <ul className="flex flex-wrap gap-2">
      {list.map((item) => {
        return (
          <li key={hashKey(entry + '_syn_', item)}>
            <Link
              className="text-sm rounded-lg bg-gray-100 px-2 py-1 dark:bg-gray-800"
              href={dicoUrl(item)}
            >
              {item}
            </Link>
          </li>
        )
      })}
    </ul>
  </section>
)

const Confers = ({
  entry,
  list,
  dicoUrl,
}: {
  entry: string
  list: string[]
  dicoUrl: (word: string) => string
}) => (
  <section className="grid gap-2 mb-2">
    <h2 className="text-lg font-bold">Voir aussi</h2>
    <ul className="flex flex-wrap gap-2">
      {list.map((item) => {
        return (
          <li key={hashKey(entry + '_confer_', item)}>
            <Link
              className="text-sm bg-gray-100 px-2 py-1 dark:bg-gray-800"
              href={dicoUrl(item)}
            >
              {item}
            </Link>
          </li>
        )
      })}
    </ul>
  </section>
)

const Usages = ({
  entry,
  list,
  dicoUrl,
}: {
  entry: string
  list: string[]
  dicoUrl: (word: string) => string
}) => (
  <div className="grid gap-2 my-3">
    <h2 className="text-lg font-bold">Usage</h2>
    <ul className="grid gap-4">
      {list.map((item) => {
        return (
          <li
            key={hashKey(entry + '_usage_', item)}
            dangerouslySetInnerHTML={{
              __html: item.replaceAll(entry, `<strong>${entry}</strong>`) || '',
            }}
          />
        )
      })}
    </ul>
  </div>
)
