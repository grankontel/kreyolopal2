'use client'

import Link from 'next/link'
import {
  MeaningLanguage,
  SingleDefinition,
  ProposalDefinition,
  KreyolLanguage,
} from '@kreyolopal/domain'
import { hashKey } from '@/lib/utils'
import { dicoUrl } from '@/lib/dicoUrl'
import { ProposalVoteButtons } from '@/components/entry/proposal-vote-buttons'
import { AddToLexicon } from './add-to-lexicon'
import { Can } from '@/components/can'
import { AnyAbility } from '@casl/ability'
import { useDashboard } from '@/components/dashboard/dashboard-provider'

function convertDefinition<T>(definition: SingleDefinition | ProposalDefinition): T {
  return definition as unknown as T
}

export interface EntryDefinitionProps {
  entry: string
  kreyol: KreyolLanguage
  index: number
  definition: SingleDefinition | ProposalDefinition
}

export const EntryDefinition = ({
  entry,
  kreyol,
  index,
  definition,
}: EntryDefinitionProps) => {
  const auth = useDashboard()
  const nature = definition.nature.join(', ')
  const subnature = definition.subnature?.length
    ? definition.subnature.join(', ')
    : nature
  const def_langues = Object.keys(definition.meaning).filter((value) => value !== 'fr')
  const isNotPrpoposal =
    'source' in definition && ['reference', 'validated'].includes(definition.source)
  const vote_allowed = auth?.enforcer.can('vote', 'proposals')
  return (
    <section className="definition border-b-2 border-b-gray-200 py-4 dark:border-b-gray-700 dark:bg-inherit">
      <div className="grid gap-2">
        <p className="nature text-md text-gray-400 dark:text-gray-600">
          <span className="font-medium">
            {index}. {subnature}{' '}
          </span>
          {isNotPrpoposal ? (
            <Can do="add" on="lexicon" ability={auth?.enforcer as AnyAbility}>
              <AddToLexicon definition={definition as SingleDefinition} />
            </Can>
          ) : (
            <ProposalVoteButtons
              definition={convertDefinition(definition)}
              disabled={!vote_allowed}
            />
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

interface KreyolSublistProps {
  entry: string
  kreyol: KreyolLanguage
  list: string[]
}

const Synonyms = ({ entry, kreyol, list }: KreyolSublistProps) => (
  <section className="mb-2 grid gap-2">
    <h2 className="text-lg font-bold">Synonymes</h2>
    <ul className="flex flex-wrap gap-2">
      {list.map((item) => {
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

const Confers = ({ entry, kreyol, list }: KreyolSublistProps) => (
  <section className="mb-2 grid gap-2">
    <h2 className="text-lg font-bold">Voir aussi</h2>
    <ul className="flex flex-wrap gap-2">
      {list.map((item) => {
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
