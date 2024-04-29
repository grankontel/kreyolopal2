'use client'

import {
  ProposalDefinition,
} from '@kreyolopal/domain'
import FeatherIcon from '../FeatherIcon'
import { useDashboard } from '@/app/dashboard/dashboard-provider'
import { Button } from '@/components/ui/button'
import type { Backer } from '@kreyolopal/domain/proposals/types'

export const ProposalVoteButtons = ({ definition }: { definition: ProposalDefinition }) => {
  const dash = useDashboard()

  const isBacker = (array: Backer[]) => array.findIndex((item) => item.user === dash?.user_id) !== -1

  return (
    <span>
      <Button size='default'
        variant={isBacker(definition.upvoters) ? 'secondary' : 'ghost'}
        disabled={isBacker(definition.upvoters)}>
        <FeatherIcon className='text-logo' iconName="thumbs-up" />&nbsp;{definition.upvoters.length}
      </Button>
      <Button size='default'
        variant={isBacker(definition.downvoters) ? 'secondary' : 'ghost'}
        disabled={isBacker(definition.downvoters)}>
        <FeatherIcon className='text-logo' iconName="thumbs-down" />&nbsp;{definition.downvoters.length}
      </Button>
    </span>
  )
}
