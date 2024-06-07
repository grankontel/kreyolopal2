'use client'

import { ProposalDefinition } from '@kreyolopal/domain'
import FeatherIcon from '../FeatherIcon'
import { useDashboard } from '@/components/dashboard/dashboard-provider'
import { Button } from '@/components/ui/button'
import type { Backer } from '@kreyolopal/domain'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useToast } from '@/components/ui/use-toast'
import { downVote, getVotes, upVote } from '@/queries/proposals/votes'

interface VoteData {
  upvoters: Backer[]
  downvoters: Backer[]
}

interface ProposalVoteButtonsProps {
  definition: ProposalDefinition
  disabled?: boolean
}

export const ProposalVoteButtons = ({
  definition,
  disabled = false,
}: ProposalVoteButtonsProps) => {
  const queryClient = useQueryClient()
  const dash = useDashboard()
  const { toast } = useToast()
  const notifyer = (err: { error?: string; toString: () => string }) => {
    toast({
      title: 'Erreur',
      variant: 'destructive',
      description: err?.error || err.toString(),
    })
  }

  const isBacker = (array: Backer[]) =>
    array.findIndex((item) => item.user === dash?.user_id) !== -1

  const { data }: { data: VoteData } = useQuery({
    queryKey: ['proposals', definition.entry, definition.definition_id],
    queryFn: () =>
      getVotes(dash?.session_id as string, definition.entry, definition.definition_id),
    initialData: {
      upvoters: definition.upvoters,
      downvoters: definition.downvoters,
    },
    staleTime: 500,
  })

  const handleUpVote = useMutation({
    mutationFn: () =>
      upVote(dash?.session_id as string, definition.entry, definition.definition_id),
    onSuccess: () => {
      toast({
        variant: 'default',
        description: 'Vote enregistré',
      })
      queryClient.invalidateQueries({
        queryKey: ['proposals', definition.entry, definition.definition_id],
      })
    },
    onError: (err: Error) => {
      notifyer(err)
    },
  })

  const handleDownVote = useMutation({
    mutationFn: () =>
      downVote(dash?.session_id as string, definition.entry, definition.definition_id),
    onSuccess: () => {
      toast({
        variant: 'default',
        description: 'Vote enregistré',
      })
      queryClient.invalidateQueries({
        queryKey: ['proposals', definition.entry, definition.definition_id],
      })
    },
    onError: (err: Error) => {
      notifyer(err)
    },
  })

  return (
    <span>
      <Button
        size="default"
        variant={isBacker(data.upvoters) ? 'secondary' : 'ghost'}
        disabled={disabled || isBacker(data.upvoters)}
        onClick={(e) => {
          e.preventDefault()
          handleUpVote.mutate()
        }}
      >
        <FeatherIcon className="text-logo" iconName="thumbs-up" />
        &nbsp;{data.upvoters.length}
      </Button>
      <Button
        size="default"
        variant={isBacker(data.downvoters) ? 'secondary' : 'ghost'}
        disabled={disabled || isBacker(data.downvoters)}
        onClick={(e) => {
          e.preventDefault()
          handleDownVote.mutate()
        }}
      >
        <FeatherIcon className="text-logo" iconName="thumbs-down" />
        &nbsp;{data.downvoters.length}
      </Button>
    </span>
  )
}
