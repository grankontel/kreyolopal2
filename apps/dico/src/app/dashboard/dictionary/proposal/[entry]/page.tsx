import { isLoggedIn } from '@/app/dashboard/is-logged-in'
import { EntryDefinitionList } from '@/components/entry/entry-definition-list'
import { EntryTitle } from '@/components/entry/entry-title'
import { AddEntry } from '@/components/forms/add-entry'
import { checkWord } from '@/queries/check-word'
import { getProposedWord } from '@/queries/get-word'
import { redirect } from 'next/navigation'
import { ProposalEntry } from '@kreyolopal/domain'

export const runtime = 'edge'

export default async function Page({ params }: { params: { entry: string } }) {
  const token = isLoggedIn()
  if (!token) {
    return undefined
  }
  const { entry } = params

  const data = await checkWord(token, entry)
  if (data) {
    redirect(`/dashboard/dictionary/gp/${entry}`)
  }

  const entryInfo = await getProposedWord(token, 'gp', entry)
  const source: ProposalEntry = entryInfo?.entry ?? { entry, docType: 'entry', variations: [], definitions: []}
  return (
    <div>
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 py-6">
          <div className="container space-y-6 px-4 md:px-6">
            <EntryTitle source={source} bookmarkable={false} />
            {entryInfo === null ? (
              ' '
            ) : (
              <div className="above-article flex flex-row">
                <EntryDefinitionList
                  entry={source.entry}
                  definitions={source.definitions}
                  variations={source.variations}
                  kreyol={'gp'}
                  showForm={true}
                />
              </div>
            )}

            <AddEntry entry={entry} />
          </div>
        </main>
      </div>
    </div>
  )
}
