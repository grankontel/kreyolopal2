import { SingleDefinition, ProposalDefinition, KreyolLanguage } from '@kreyolopal/domain'
import { hashKey } from '@/lib/utils'
import { EntryDefinition } from './entry-definition'

interface EntryDefinitionListProps {
  entry: string
  kreyol: KreyolLanguage
  definitions: SingleDefinition[] | ProposalDefinition[]
}

export const EntryDefinitionList = ({
  entry,
  kreyol,
  definitions,
}: EntryDefinitionListProps) => {
  return (
    <article className="basis-3/4  gap-2">
      {definitions.map((definition, index) => (
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
