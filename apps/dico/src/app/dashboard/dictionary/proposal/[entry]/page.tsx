import { isLoggedIn } from '@/app/dashboard/is-logged-in'
import FeatherIcon from '@/components/FeatherIcon'
import { BookmarkIcon } from '@/components/bookmark-icon'
import { AddEntry } from '@/components/forms/add-entry'
import { LanguageCombobox } from '@/components/language-combobox'
import { NatureCombobox } from '@/components/nature-combobox'
import { Tags } from '@/components/tags'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export const runtime = 'edge'

export default async function Page({ params }: { params: { entry: string } }) {
  const token = isLoggedIn()
  if (!token) {
    return undefined
  }
  const { entry } = params
  return (
    <div className="flex flex-col min-h-screen">
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
