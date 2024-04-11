'use client'

import {  useState } from 'react'
import {  keepPreviousData, useQuery } from '@tanstack/react-query'
import { fetchPersonalDico } from '@/queries/fetch-personal-dico'
import { useDashboard } from '@/app/dashboard/dashboard-provider'
import { DicoTable } from "./dico-table"


export const PersonalDicoTable = () => {
  const [page, setPage] = useState(0)
  const dash = useDashboard()
	const pageHandler = {page, setPage}

	const qr = useQuery({
		queryKey: ['personalDico', page],
		queryFn: () => {
			const token: string = dash?.session_id || ''
			return fetchPersonalDico({ token, page })
		},
		placeholderData: keepPreviousData,
	})


	return (<DicoTable queryResult={qr} pageHandler={{page, setPage}} />)
}