import { SingleDefinition, ProposalDefinition, KreyolLanguage } from '@kreyolopal/domain'
import { hashKey } from '@/lib/utils'
import { EntryDefinition } from './entry-definition'
import { EntryDefinitionAndForm } from './entry-definition-and-form'

interface EntryDefinitionListProps {
  entry: string
  kreyol: KreyolLanguage
  definitions: SingleDefinition[] | ProposalDefinition[]
  variations: string[]
  showForm?: boolean
}

export const EntryDefinitionList = ({
  entry,
  kreyol,
  definitions,
  variations,
  showForm,
}: EntryDefinitionListProps) => {

  return (
    <article className="basis-3/4  gap-2">
      {showForm ? (
        <EntryDefinitionAndForm
          entry={entry}
          kreyol={kreyol}
          definitions={definitions}
          variations={variations}
        />
      ) : definitions.map((definition, index) => (
        <EntryDefinition
          key={hashKey('key_', entry + ':' + index)}
          entry={entry}
          kreyol={kreyol}
          index={index + 1}
          definition={definition}
        />
      ))}
    </article>
  )
}
