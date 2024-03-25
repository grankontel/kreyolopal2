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
    : nature;
  const def_langues = Object.keys(definition.meaning).filter((value) => value !== 'fr');

  return (
    <section className="definition py-4 border-b-gray-200 border-b-2 dark:bg-inherit dark:border-b-gray-700">
      <div className="grid gap-2">
        <p className="nature text-md text-gray-400 dark:text-gray-600">
          <span className="font-medium">
            {index}. {subnature}{' '}
          </span>
        </p>
        <section className="mb-3">
          {
            def_langues.map((lang) => {
              const k = lang as MeaningLanguage
              return (definition.meaning[k]?.length === 0) ? ('') : (
                <div className="meaning text-xl text-gray-600 dark:text-gray-500 mb-3">
                  <p>
                    [{lang}] {definition.meaning[k]}
                  </p>
                </div>
              )
            })
          }

          {definition.meaning['fr']?.length === 0 ? (
            ' '
          ) : (
            <div className="meaning font-light text-xl text-gray-500 dark:text-gray-400 mb-3">
              <p>[fr] {definition.meaning['fr']}</p>
            </div>
          )}
        </section>
      </div>
    </section>
  )
}
