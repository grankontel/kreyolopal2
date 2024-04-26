import { isLoggedIn } from '@/app/dashboard/is-logged-in'
import { BookmarkIcon } from '@/components/bookmark-icon'
import { AddEntry } from '@/components/forms/add-entry'
import { checkWord } from '@/queries/check-word'
import { redirect } from 'next/navigation'

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
  
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 py-6">
        <div className="container space-y-6 px-4 md:px-6">
          <div className="grid  items-start gap-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              <span className="flex items-center gap-2">
                <BookmarkIcon className="h-6 w-6" />
                {entry}
              </span>
            </h1>

            <AddEntry entry={entry} />
          </div>
          <div className="above-article flex flex-row"></div>
        </div>
      </main>
    </div>
  )
}
