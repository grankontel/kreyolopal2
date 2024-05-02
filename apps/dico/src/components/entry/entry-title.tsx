import { DictionaryEntry, ProposalEntry } from '@kreyolopal/domain'
import { BookmarkIcon } from '@/components/bookmark-icon'
import { EntryBookmarkButton } from './entry-bookmark-button'

export function EntryTitle({
  source,
  bookmarkable,
  bookmarked,
  ...props
}: {
  source: DictionaryEntry | ProposalEntry
  bookmarkable: boolean
  bookmarked?: boolean
}) {
  return (
    <div className="grid items-start gap-2">
      <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
        <span className="flex items-center gap-2">
          {bookmarkable ? (
            <EntryBookmarkButton entry={source.entry} bookmarked={bookmarked || false} />
          ) : (
            <BookmarkIcon className="h-6 w-6" />
          )}
          {source.entry}
        </span>
      </h1>
      <p className="text-gray-500 dark:text-gray-400">{source.variations.join(' /')}</p>
    </div>
  )
}
