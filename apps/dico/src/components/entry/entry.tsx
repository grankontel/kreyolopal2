/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/7Zyk89nt9tB
 */
import Link from 'next/link'
import { UserDictionaryEntry, UserProposalEntry } from '@/lib/types'
import {
  DictionaryFullEntry,
  KreyolLanguage,
  SingleDefinition,
  ProposalEntry,
} from '@kreyolopal/domain'
import { hashKey, onlyUnique } from '@/lib/utils'
import { EntryDefinitionList } from './entry-definition-list'
import { dicoUrl } from '@/lib/dicoUrl'
import { EntryTitle } from './entry-title'

export function Entry<T  extends (UserDictionaryEntry | UserProposalEntry)>({ kreyol, value, ...props }: { kreyol: KreyolLanguage; value: T }) {
  let source = value.entry
  if ('is_bookmarked' in value && 'bookmark' in value && value.is_bookmarked) {
    source = value.bookmark as DictionaryFullEntry
  }

  const relatedList: string[] = [source]
    .map((entry) => {
      const syns = entry.definitions
        .map((def) => {
          return def.synonyms
        })
        .flat()
      const confer = entry.definitions
        .map((def) => {
          return def.confer
        })
        .flat()
      return syns.concat(confer)
    })
    .flat()
    .filter(onlyUnique)
  //    const relatedList: string[] = []
  return (
    <div className="flex min-h-screen flex-col" {...props}>
      <main className="flex-1 py-6">
        <div className="container space-y-6 px-4 md:px-6">
          <EntryTitle
            source={source}
            bookmarkable={'is_bookmarked' in value}
            bookmarked={
              'is_bookmarked' in value ? (value.is_bookmarked as boolean) : false
            }
          />

          <div className="above-article flex flex-row">
            <EntryDefinitionList
              entry={source.entry}
              variations={source.variations}
              definitions={source.definitions}
              kreyol={kreyol}
            />

            <aside className="hidden basis-1/4  px-4 md:block">
              {relatedList.length === 0 ? (
                ' '
              ) : (
                <div className="sticky top-20">
                  <div className="rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
                    <h3 className="mb-2 text-lg font-semibold">Voir aussi</h3>
                    <ul className="space-y-2">
                      {relatedList.map((item: string) => (
                        <li key={hashKey('also_', item)}>
                          <Link
                            className="text-gray-700 hover:underline dark:text-gray-300"
                            href={dicoUrl(kreyol, item)}
                          >
                            {item.charAt(0).toUpperCase() + item.slice(1)}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </main>
    </div>
  )
}
