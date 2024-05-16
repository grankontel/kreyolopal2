'use client'

import { useState } from 'react'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useDashboard } from '@/components/dashboard/dashboard-provider'
import { DicoTable } from './dico-table'
import { fetchLexiconEntries } from '@/queries/fetch-lexicon-entries'

interface LexiconDicoTableProps {
  username: string
  slug: string
}
export const LexiconDicoTable = (props: LexiconDicoTableProps) => {
  const [page, setPage] = useState(0)
  const dash = useDashboard()
  const pageHandler = { page, setPage }
  const { username, slug } = props

  const qr = useQuery({
    queryKey: ['me', 'lexicons', username, slug, page],
    queryFn: () => {
      const token: string = dash?.session_id || ''
      return fetchLexiconEntries({ token, username, slug, page })
    },
    placeholderData: keepPreviousData,
  })

  return <DicoTable queryResult={qr} pageHandler={pageHandler} />
}
