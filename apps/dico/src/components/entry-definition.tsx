'use client'
import Link from 'next/link'
import {
  MeaningLanguage,
  SingleDefinition,
  ProposalDefinition,
  KreyolLanguage,
} from '@kreyolopal/domain'
import { hashKey } from '@/lib/utils'
import FeatherIcon from './FeatherIcon'
import { DropdownMenu, DropdownMenuTrigger } from './ui/dropdown-menu'
import { LexiconDropdownMenu } from './lexicons/lexicon-dropdown-menu'
import { dicoUrl } from '@/lib/dicoUrl'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useDashboard } from '@/app/dashboard/dashboard-provider'
import { useToast } from '@/components/ui/use-toast'
import { addEntries } from '@/queries/lexicons/add-entries'
import { useState } from 'react'
import { ProposalVoteButtons } from './proposal-vote-buttons'

interface EntryDefinitionProps {
  entry: string
  kreyol: KreyolLanguage
  index: number
  definition: SingleDefinition | ProposalDefinition
}

const AddToLexicon = ({ definition }: { definition: SingleDefinition }) => {
  const dash = useDashboard()
  const { toast } = useToast()
  const notifyer = (err: { error?: string; toString: () => string }) => {
    toast({
      title: 'Erreur',
      variant: 'destructive',
      description: err?.error || err.toString(),
    })
  }

  console.log(definition)
  
  const addEntry = useMutation({
    mutationFn: ({ lexiconId }: { lexiconId: string }) => {
      return addEntries(
        lexiconId,
        {
          entry: definition.entry,
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
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={`focus-visible:ring-ring border-input bg-background hover:bg-accent hover:text-accent-foreground 
    inline-flex h-9 w-9 items-center justify-center whitespace-nowrap 
    rounded-md border text-sm font-medium shadow-sm transition-colors 
    focus-visible:outline-none focus-visible:ring-1 disabled:pointer-events-none disabled:opacity-50`}
      >
        <FeatherIcon iconName="chevron-right" />
      </DropdownMenuTrigger>
      <LexiconDropdownMenu
        onSelect={(item) => {
          addEntry.mutate({ lexiconId: item.id })
        }}
      />
    </DropdownMenu>
  )
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
              source: (definition as SingleDefinition).source,
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
    <section className="definition border-b-2 border-b-gray-200 py-4 dark:border-b-gray-700 dark:bg-inherit">
      <div className="grid gap-2">
        <p className="nature text-md text-gray-400 dark:text-gray-600">
          <span className="font-medium">
            {index}. {subnature}{' '}
          </span>
          {definition.source != 'proposals' ? (
            <AddToLexicon definition={definition as SingleDefinition} />
          ) : (
            <ProposalVoteButtons definition={definition as ProposalDefinition} />
          )}
        </p>
        <section className="mb-3">
          {def_langues.map((lang) => {
            const k = lang as MeaningLanguage
            return definition.meaning[k]?.length === 0 ? (
              ''
            ) : (
              <div className="meaning mb-3 text-xl text-gray-600 dark:text-gray-500">
                <p>
                  [{lang}] {definition.meaning[k]}
                </p>
              </div>
            )
          })}

          {definition.meaning['fr']?.length === 0 ? (
            ' '
          ) : (
            <div className="meaning mb-3 text-xl font-light text-gray-500 dark:text-gray-400">
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
  <section className="mb-2 grid gap-2">
    <h2 className="text-lg font-bold">Synonymes</h2>
    <ul className="flex flex-wrap gap-2">
      {list.map(async (item) => {
        return (
          <li key={hashKey(entry + '_syn_', item)}>
            <Link
              className="rounded-lg bg-gray-100 px-2 py-1 text-sm dark:bg-gray-800"
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
  <section className="mb-2 grid gap-2">
    <h2 className="text-lg font-bold">Voir aussi</h2>
    <ul className="flex flex-wrap gap-2">
      {list.map(async (item) => {
        return (
          <li key={hashKey(entry + '_confer_', item)}>
            <Link
              className="bg-gray-100 px-2 py-1 text-sm dark:bg-gray-800"
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
  <div className="my-3 grid gap-2">
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
