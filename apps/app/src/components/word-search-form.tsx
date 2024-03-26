'use client'

import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { IconAttributes } from '@kreyolopal/react-ui'
import { getEntries, useGetSuggestions } from '@/queries/get-suggestions'
import { DictionaryEntry } from '@/lib/types'
import debounce from 'lodash.debounce'

function SearchIcon(props: IconAttributes) {
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
    const [open, setOpen]= useState(false)
  const [word, setWord] = useState('')
    const debounceSetWord = debounce(setWord, 1000)
    useEffect(() => {
        return () => {
            debounceSetWord.cancel()
        }
      })
    
  const {
    data: words,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['suggest', word],
    queryFn: async ({ queryKey }) => {
      const [_, word] = queryKey
      console.log(word)
      const rep = await getEntries(word)
      return rep
    },
  })
  console.log(words)

  return (
    <form className="flex-1">
      <div className="relative">
        <Input
          className="w-full md:max-w-sm"
          placeholder="Search for a word"
          type="search"
          onChange={(e) => {
            debounceSetWord(e.target.value)
          }}
        />
        <Button
          className="absolute top-1/2 right-2 transform -translate-y-1/2"
          type="submit"
        >
          <SearchIcon className="w-4 h-4" />
          <span className="sr-only">Search</span>
        </Button>
      </div>
    </form>
  )
}
