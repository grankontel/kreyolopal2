'use client'
import Link from 'next/link'
import { MeaningLanguage, SingleDefinition } from '@kreyolopal/domain'
import { hashKey } from '@/lib/utils'
import FeatherIcon from './FeatherIcon'
import { DropdownMenu, DropdownMenuTrigger } from './ui/dropdown-menu'
import { LexiconDropdownMenu } from './lexicons/lexicon-dropdown-menu'
import { KreyolLanguage } from '@kreyolopal/react-ui'
import { dicoUrl } from '@/lib/dicoUrl'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useDashboard } from '@/app/dashboard/dashboard-provider'
import { useToast } from '@/components/ui/use-toast'
import { AddEntriesPayload, addEntries } from '@/queries/lexicons/add-entries'
import { useState } from 'react'

interface EntryDefinitionProps {
  entry: string
  kreyol: KreyolLanguage
  index: number
  definition: SingleDefinition
}

export const EntryDefinition = ({
  entry,
  kreyol,
  index,
  definition,
}: EntryDefinitionProps) => {
  const [lexiconId, setLexiconId] = useState<string>()
  const dash = useDashboard()
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const notifyer = (err: { error?: string; toString: () => string }) => {
    toast({
      title: 'Erreur',
      variant: 'destructive',
      description: err?.error || err.toString(),
    })
  }

  const addEntry = useMutation({
    mutationFn: () => {
      return addEntries(
        lexiconId as string,
        {
          entry: entry,
          definitions: [
            {
              source: definition.source,
              id: definition.definition_id,
            },
          ],
        },
        dash?.session_id
      )
    },
    onSuccess: () => {
      toast({
        variant: 'default',
        description: 'Entrée ajoutée',
      })
    },
    onError: (err: Error) => {
      notifyer(err)
    },
  })
  const nature = definition.nature.join(', ')
  const subnature = definition.subnature?.length
    ? definition.subnature.join(', ')
    : nature
  const def_langues = Object.keys(definition.meaning).filter((value) => value !== 'fr')

  return (
    <section className="definition py-4 border-b-gray-200 border-b-2 dark:bg-inherit dark:border-b-gray-700">
      <div className="grid gap-2">
        <p className="nature text-md text-gray-400 dark:text-gray-600">
          <span className="font-medium">
            {index}. {subnature}{' '}
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-md 
              text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring 
              disabled:pointer-events-none disabled:opacity-50 border-input bg-background shadow-sm hover:bg-accent 
              hover:text-accent-foreground h-9 w-9 border`}
            >
              <FeatherIcon iconName="chevron-right" />
            </DropdownMenuTrigger>
            <LexiconDropdownMenu
              onSelect={(item) => {
                setLexiconId(item.id)
                addEntry.mutate()
              }}
            />
          </DropdownMenu>
        </p>
        <section className="mb-3">
          {def_langues.map((lang) => {
            const k = lang as MeaningLanguage
            return definition.meaning[k]?.length === 0 ? (
              ''
            ) : (
              <div className="meaning text-xl text-gray-600 dark:text-gray-500 mb-3">
                <p>
                  [{lang}] {definition.meaning[k]}
                </p>
              </div>
            )
          })}

          {definition.meaning['fr']?.length === 0 ? (
            ' '
          ) : (
            <div className="meaning font-light text-xl text-gray-500 dark:text-gray-400 mb-3">
              <p>[fr] {definition.meaning['fr']}</p>
            </div>
          )}
        </section>

        {definition.synonyms.length === 0 ? (
          ' '
        ) : (
          <Synonyms entry={entry} list={definition.synonyms} kreyol={kreyol} />
        )}

        {definition.confer.length === 0 ? (
          ' '
        ) : (
          <Confers entry={entry} list={definition.confer} kreyol={kreyol} />
        )}

        {definition.usage.length === 0 ? (
          ' '
        ) : (
          <Usages entry={entry} list={definition.usage} kreyol={kreyol} />
        )}
      </div>
    </section>
  )
}

const Synonyms = ({
  entry,
  kreyol,
  list,
}: {
  entry: string
  kreyol: KreyolLanguage
  list: string[]
}) => (
  <section className="grid gap-2 mb-2">
    <h2 className="text-lg font-bold">Synonymes</h2>
    <ul className="flex flex-wrap gap-2">
      {list.map(async (item) => {
        return (
          <li key={hashKey(entry + '_syn_', item)}>
            <Link
              className="text-sm rounded-lg bg-gray-100 px-2 py-1 dark:bg-gray-800"
              href={dicoUrl(kreyol, item)}
            >
              {item}
            </Link>
          </li>
        )
      })}
    </ul>
  </section>
)

const Confers = ({
  entry,
  kreyol,
  list,
}: {
  entry: string
  kreyol: KreyolLanguage
  list: string[]
}) => (
  <section className="grid gap-2 mb-2">
    <h2 className="text-lg font-bold">Voir aussi</h2>
    <ul className="flex flex-wrap gap-2">
      {list.map(async (item) => {
        return (
          <li key={hashKey(entry + '_confer_', item)}>
            <Link
              className="text-sm bg-gray-100 px-2 py-1 dark:bg-gray-800"
              href={dicoUrl(kreyol, item)}
            >
              {item}
            </Link>
          </li>
        )
      })}
    </ul>
  </section>
)

const Usages = ({
  entry,
  kreyol,
  list,
}: {
  entry: string
  kreyol: KreyolLanguage
  list: string[]
}) => (
  <div className="grid gap-2 my-3">
    <h2 className="text-lg font-bold">Usage</h2>
    <ul className="grid gap-4">
      {list.map((item) => {
        return (
          <li
            key={hashKey(entry + '_usage_', item)}
            dangerouslySetInnerHTML={{
              __html: item.replaceAll(entry, `<strong>${entry}</strong>`) || '',
            }}
          />
        )
      })}
    </ul>
  </div>
)
