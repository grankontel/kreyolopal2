import { WordSearchForm } from './forms/word-search-form'

export function EntryHeader() {
  return (
    <header className="border-y-2 border-y-gray-200 py-4 pb-4 dark:border-y-gray-700 dark:bg-gray-800">
      <div className="container flex items-center gap-4 px-4 md:px-6 ">
        <WordSearchForm />
      </div>
    </header>
  )
}
