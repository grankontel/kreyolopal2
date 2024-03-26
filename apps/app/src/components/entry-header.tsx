import { WordSearchForm } from "./word-search-form";


export function EntryHeader() {
  return (
    <header className="py-4 pb-4 border-y-gray-200 border-y-2 dark:bg-gray-800 dark:border-y-gray-700">
      <div className="container flex items-center gap-4 px-4 md:px-6 ">
        <WordSearchForm />
      </div>
    </header>
  )
}
