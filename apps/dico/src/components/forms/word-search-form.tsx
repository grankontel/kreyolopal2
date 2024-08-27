'use client'

import { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { getEntries } from '@/queries/get-suggestions'
import { DictionaryEntry } from '@kreyolopal/domain'
import debounce from 'lodash.debounce'
import { useRouter } from 'next/navigation'
import { hashKey } from '@/lib/utils'
import { useDashboard } from '@/components/dashboard/dashboard-provider'

function SearchIcon(props: React.SVGProps<SVGSVGElement>) {
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

export type EntrySelectedHandler = (entry: DictionaryEntry) => void

export function WordSearchForm() {
  const router = useRouter()
  const [word, setWord] = useState('')
  const debounceSetWord = debounce(setWord, 500)
  const auth = useDashboard()
  useEffect(() => {
    return () => {
      debounceSetWord.cancel()
    }
  })

  const {
    data: words,
    error,
    isLoading,
  } = useQuery({
    queryKey: ['suggest', word],
    queryFn: async ({ queryKey }) => {
      const [_, word] = queryKey
      const rep = await getEntries(word, auth?.session_id as string)
      return rep
    },
  })

  const ProposeWord = ({ word }: { word: string }) => (
    <li key="add_word">
      <Button
        className="w-full justify-start text-left"
        variant="ghost"
        onClick={(e) => {
          e.preventDefault()
          router.push(`/dashboard/dictionary/proposal/${word}`)
        }}
      >
        Ajouter {word}
      </Button>
    </li>
  )

  return (
    <form className="flex-1">
      <div className="relative">
        <div className="relative">
          <Input
            className="w-full "
            placeholder="Search for a word"
            type="search"
            onChange={(e) => {
              debounceSetWord(e.target.value)
            }}
          />
          <div className="absolute left-0 top-full z-10 mt-2 w-full bg-white shadow-lg drop-shadow-md dark:bg-gray-800">
            {words === undefined || words?.length === 0 ? (
              word.length > 0 ? (
                <ul className="divide-y divide-gray-200 dark:divide-gray-900">
                  <ProposeWord word={word} />
                </ul>
              ) : (
                ''
              )
            ) : (
              <ul className="divide-y divide-gray-200 dark:divide-gray-900">
                {words.map((item: DictionaryEntry, index: any) => {
                  return (
                    <li key={hashKey('entry', item.entry)}>
                      <Button
                        className="w-full justify-start text-left"
                        variant="ghost"
                        onClick={(e) => {
                          e.preventDefault()
                          router.push(
                            `/dashboard/dictionary/gp/${encodeURI(item.aliasOf ?? item.entry)}`
                          )
                        }}
                      >
                        {item.entry}
                      </Button>
                    </li>
                  )
                })}
                {word.length > 0 &&
                words.findIndex((item) => item.entry === word) === -1 ? (
                  <ProposeWord word={word} />
                ) : (
                  ''
                )}
              </ul>
            )}
          </div>
        </div>
        <Button
          className="absolute right-2 top-1/2 -translate-y-1/2 transform"
          type="submit"
        >
          <SearchIcon className="h-4 w-4" />
          <span className="sr-only">Search</span>
        </Button>
      </div>
    </form>
  )
}
