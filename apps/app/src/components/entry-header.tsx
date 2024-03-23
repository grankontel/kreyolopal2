import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

function BookOpenIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  )
}

function SearchIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}

export function WordSearchForm() {
  return (
    <form className="flex-1">
      <div className="relative">
        <Input className="w-full md:max-w-sm" placeholder="Search for a word" type="search" />
        <Button className="absolute top-1/2 right-2 transform -translate-y-1/2" type="submit">
          <SearchIcon className="w-4 h-4" />
          <span className="sr-only">Search</span>
        </Button>
      </div>
    </form>
  )
}

export function EntryHeader() {
return (
	<header className="py-4 pb-4 border-y-gray-200 border-y-2 dark:bg-gray-800 dark:border-y-gray-700">
	<div className="container flex items-center gap-4 px-4 md:px-6 ">
		<WordSearchForm />
	</div>
</header>

)
}