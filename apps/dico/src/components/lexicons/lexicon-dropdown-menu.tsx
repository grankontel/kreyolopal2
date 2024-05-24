'use client'

import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
import { Lexicon } from '@kreyolopal/domain'
import { useDicoStore } from '@/store/dico-store'
import { EditLexiconDialogContent } from './edit-lexicon-dialog'

export const LexiconDropdownMenu = ({
  onSelect,
}: {
  onSelect: (item: Lexicon) => void
}) => {
  const { lexicons } = useDicoStore()
  return (
    <DropdownMenuContent>
      <DropdownMenuLabel>Ajouter à...</DropdownMenuLabel>
      {lexicons.length > 0 ? (<DropdownMenuSeparator />) : ''}
      {lexicons.map((lexicon) => {
        return (
          <DropdownMenuItem key={lexicon.id} onSelect={() => onSelect(lexicon)}>
            {lexicon.name}
          </DropdownMenuItem>
        )
      })}
      <DropdownMenuSeparator />
    </DropdownMenuContent>
  )
}
