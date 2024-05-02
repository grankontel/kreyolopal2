'use client'

import { Dispatch, JSX, SetStateAction, useEffect, useState } from 'react'
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from '@/components/ui/table'
import { PaginatedDico } from '@/lib/types'
import { makeId, hashKey } from '@/lib/utils'
import { LangFlag } from '@kreyolopal/react-ui'
import { SingleDefinition, DictionaryFullEntry, KreyolLanguage } from '@kreyolopal/domain'
import DicoTableCell from '@/components/dicotable/dico-table-cell'
import { UseQueryResult } from '@tanstack/react-query'
import Link from 'next/link'
import { DicoTableSkeleton } from './dico-table-skeleton'
import { TableError } from './table-error'

type WordRow = {
  id: string
  definition_key: {
    entry: string
    kreyol: KreyolLanguage
    definition_rank: number
  }
  entry: string
  entry_rowspan: number
  url: string
  variations: string[]
  langue: KreyolLanguage
  Flag: JSX.Element
  flag_rowspan: number
  nature: string[]
  definition_cpf: string | undefined
  definition_fr: string | undefined
  usage: string[]
  synonyms: string[]
  confer: string[]
}

function wordsToRow(words: DictionaryFullEntry[]): WordRow[] {
  const lignes: WordRow[] = []
  words.forEach((word) => {
    const defs = Object.entries(word.definitions).map((item) => {
      return {
        langue: item[0] as KreyolLanguage,
        definitions: item[1] as SingleDefinition[],
      }
    })
    const totalDefs = defs.reduce((nbdefs, item) => nbdefs + item.definitions.length, 0)
    defs.forEach(({ langue, definitions }, langue_index) => {
      definitions.forEach((definition, def_index) => {
        const line_index = langue_index + def_index
        const entry_rowspan = totalDefs === 1 ? 1 : line_index === 0 ? totalDefs : 0
        lignes.push({
          id: makeId(word.entry, langue, line_index),
          definition_key: {
            entry: word.entry,
            kreyol: langue,
            definition_rank: def_index,
          },
          entry: word.entry,
          url: `/dashboard/dictionary/${langue}/${encodeURI(word.entry)}`,
          entry_rowspan,
          variations: word.variations,
          langue,
          Flag: <LangFlag langue={langue} width="24" height="12" />,
          flag_rowspan:
            definitions.length === 1 ? 1 : def_index === 0 ? definitions.length : 0,
          nature: definition.nature,
          definition_cpf: definition.meaning[langue],
          definition_fr: definition.meaning['fr'],
          usage: definition.usage,
          synonyms: definition.synonyms,
          confer: definition.confer,
        })
      })
    })
  })
  return lignes
}

const DicoTableHeaders = () => (
  <TableHeader>
    <tr>
      <TableHead className="w-[150px]">Entr&eacute;e</TableHead>
      <TableHead className="w-[150px]">Variations</TableHead>
      <TableHead className="w-[26px]">Kr&eacute;y&ograve;l</TableHead>
      <TableHead className="w-[150px]">Nature</TableHead>
      <TableHead className="w-[150px]">D&eacute;finition</TableHead>
      <TableHead className="w-[150px]">D&eacute;finition (FR)</TableHead>
      <TableHead className="w-[150px]">Usage</TableHead>
      <TableHead className="w-[150px]">Synonyme</TableHead>
      <TableHead className="w-[150px]">Voir&nbsp;aussi</TableHead>
    </tr>
  </TableHeader>
)

interface DicoTableProps {
  pageHandler: {
    page: number
    setPage: Dispatch<SetStateAction<number>>
  }
  queryResult: UseQueryResult<PaginatedDico, Error>
}

export const DicoTable = ({ queryResult, pageHandler }: DicoTableProps) => {
  const { page, setPage } = pageHandler

  const { isPending, isError, error, data, isFetching, isPlaceholderData } = queryResult

  const [lignes, setLignes] = useState<WordRow[]>([])
  useEffect(() => {
    if (data) {
      setLignes(wordsToRow(data.entries))
    }
  }, [data])

  return isPending ? (
    <DicoTableSkeleton />
  ) : isError ? (
    <TableError message={error.message} />
  ) : lignes.length > 0 ? (
    <Table>
      <DicoTableHeaders />
      <TableBody>
        {lignes.map((ligne) => {
          return (
            <TableRow key={ligne.id}>
              {ligne.entry_rowspan === 0 ? null : (
                <TableCell rowSpan={ligne.entry_rowspan} className="mt-2 align-top">
                  {ligne.entry}
                </TableCell>
              )}
              {ligne.entry_rowspan === 0 ? null : (
                <TableCell rowSpan={ligne.entry_rowspan} className="mt-2 align-top">
                  {ligne.variations.map((variation) => {
                    return <div key={hashKey('var_', variation)}>{variation}</div>
                  })}
                </TableCell>
              )}
              {ligne.flag_rowspan === 0 ? null : (
                <TableCell rowSpan={ligne.flag_rowspan} className="mt-2 align-top">
                  <Link href={ligne.url}>{ligne.Flag}</Link>
                </TableCell>
              )}
              <TableCell className="mt-2 align-top">{ligne.nature}</TableCell>
              <TableCell>{ligne.definition_cpf}</TableCell>
              <TableCell>{ligne.definition_fr}</TableCell>
              <DicoTableCell
                entry={ligne.definition_key}
                name="usage"
                value={ligne.usage.map((txt) => (
                  <div key={hashKey('usage_', txt)}>{txt}</div>
                ))}
                onAdd={(id) => console.log(id)}
              />
              <DicoTableCell
                entry={ligne.definition_key}
                name="synonyms"
                value={ligne.synonyms.map((txt) => (
                  <div key={hashKey('syn_', txt)}>{txt}</div>
                ))}
                onAdd={(id) => console.log(id)}
              />
              <DicoTableCell
                entry={ligne.definition_key}
                name="confer"
                value={ligne.confer.map((txt) => (
                  <div key={hashKey('confer_', txt)}>{txt}</div>
                ))}
                onAdd={(id) => console.log(id)}
              />
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  ) : ('Aucune entrée trouvée')
}
