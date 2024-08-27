'use client'

import { SingleDefinition } from '@kreyolopal/domain'
import FeatherIcon from '../FeatherIcon'
import { DropdownMenu, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { LexiconDropdownMenu } from '@/components/lexicons/lexicon-dropdown-menu'
import { useMutation } from '@tanstack/react-query'
import { useDashboard } from '@/components/dashboard/dashboard-provider'
import { useToast } from '@/components/ui/use-toast'
import { addEntries } from '@/queries/lexicons/add-entries'

export const AddToLexicon = ({ definition }: { definition: SingleDefinition }) => {
  const dash = useDashboard()
  const { toast } = useToast()
  const notifyer = (err: { error?: string; toString: () => string }) => {
    toast({
      title: 'Erreur',
      variant: 'destructive',
      description: err?.error || err.toString(),
    })
  }

  const addEntry = useMutation({
    mutationFn: async ({ lexiconId }: { lexiconId: string }) => {
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
