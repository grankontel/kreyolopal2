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
import { Switch } from '@/components/ui/switch'
import { useDicoStore } from '@/store/dico-store'
import Link from 'next/link'
import { IconAttributes } from '@kreyolopal/react-ui'
import FeatherIcon from '../FeatherIcon'
import { EditLexiconDialogContent } from './edit-lexicon-dialog'
import { useState } from 'react'
import { Lexicon } from '@/lib/lexicons/types'
import { Dialog } from '../ui/dialog'
import { AlertDialog } from '../ui/alert-dialog'
import { ConfirmDialogContent } from '../confirm-dialog'



export const LexiconTable = () => {
  const { lexicons } = useDicoStore()
  const [currentLexicon, setCurrentLexicon] = useState<Lexicon | undefined>(undefined)
  const [isEditOpen, setEditOpen] = useState(false)
  const [isDeleteOpen, setDeleteOpen] = useState(false)

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Privé ?</TableHead>
            <TableHead className="w-24">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {lexicons.map((lexicon) => {
            return (
              <TableRow key={lexicon.id}>
                <TableCell>
                  <strong>
                    {lexicon.name}</strong>
                </TableCell>
                <TableCell>{lexicon.description}</TableCell>
                <TableCell>
                  <Link href={`/dashboard${lexicon.path}`}>{lexicon.slug}</Link>
                </TableCell>
                <TableCell>
                  <Switch checked={lexicon.is_private} disabled />
                </TableCell>
                <TableCell className="w-24 grid gap-1 grid-cols-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => {
                      setCurrentLexicon(lexicon)
                      setEditOpen(true)
                    }}
                  >
                    <FeatherIcon iconName="edit" />
                  </Button>
                  <Button size="icon" variant="outline"
                    onClick={() => {
                      setCurrentLexicon(lexicon)
                      setDeleteOpen(true)
                    }}

                  >
                    <FeatherIcon iconName="trash-2" />
                  </Button>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
      {currentLexicon === undefined ? (
        ''
      ) : (
        <div>
          <Dialog onOpenChange={setEditOpen} open={isEditOpen} modal defaultOpen={isEditOpen}>
            <EditLexiconDialogContent lexicon={currentLexicon} />
          </Dialog>
          <AlertDialog onOpenChange={setDeleteOpen} open={isDeleteOpen} defaultOpen={isDeleteOpen}>
            <ConfirmDialogContent onAction={() => console.log(currentLexicon.id)} />
          </AlertDialog>
        </div>
      )}
    </>
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
