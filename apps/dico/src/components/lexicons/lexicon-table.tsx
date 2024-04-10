'use client'

import { Button } from '@/components/ui/button'
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { useDicoStore } from '@/store/dico-store'
import Link from 'next/link'
import { IconAttributes } from '@kreyolopal/react-ui'
import FeatherIcon from '../FeatherIcon'
import { EditLexiconDialogContent } from './edit-lexicon-dialog'
import { useState } from 'react'
import { Lexicon } from '@/lib/lexicons/types'
import { Dialog, DialogTrigger } from '../ui/dialog'

export const LexiconTable = () => {
  const { lexicons } = useDicoStore()
  const [currentLexicon, setCurrentLexicon] = useState<Lexicon | undefined>(undefined)

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">Select</TableHead>
          <TableHead>Nom</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Slug</TableHead>
          <TableHead>Privé ?</TableHead>
          <TableHead className="w-24">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <Dialog>
          {lexicons.map((lexicon) => {
            return (
              <TableRow key={lexicon.id}>
                <TableCell className="w-12">
                  <Checkbox />
                </TableCell>
                <TableCell>{lexicon.name}</TableCell>
                <TableCell>{lexicon.description}</TableCell>
                <TableCell>
                  <Link href={`/dashboard${lexicon.path}`}>{lexicon.slug}</Link>
                </TableCell>
                <TableCell>
                  <Switch checked={lexicon.is_private} disabled />
                </TableCell>
                <TableCell className="w-24 grid gap-1 grid-cols-2">
                  <DialogTrigger asChild>
                    <Button size="icon" variant="outline" onClick={() => setCurrentLexicon(lexicon)}>
                      <FeatherIcon iconName="edit" />
                    </Button>
                  </DialogTrigger>
                  <Button size="icon" variant="outline">
                    <FeatherIcon iconName="trash-2" />
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
          { currentLexicon === undefined ? ('') : (<EditLexiconDialogContent lexicon={currentLexicon} />)}
        </Dialog>
      </TableBody>
    </Table>
  )
}

function MoreHorizontalIcon(props: IconAttributes) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  )
}
