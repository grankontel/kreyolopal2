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
import FeatherIcon from '../FeatherIcon'
import { EditLexiconDialogContent } from './edit-lexicon-dialog'
import { useState } from 'react'
import { Lexicon } from '@kreyolopal/domain'
import { Dialog, DialogTrigger } from '../ui/dialog'
import { AlertDialog } from '../ui/alert-dialog'
import { ConfirmDialogContent } from '../confirm-dialog'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useDashboard } from '@/app/dashboard/dashboard-provider'
import { deleteLexicon } from '@/queries/lexicons/put-lexicon'
import { useToast } from '@/components/ui/use-toast'

export const LexiconTable = () => {
  const { lexicons } = useDicoStore()
  const [currentLexicon, setCurrentLexicon] = useState<Lexicon | undefined>(undefined)
  const [isEditOpen, setEditOpen] = useState(false)
  const [isDeleteOpen, setDeleteOpen] = useState(false)

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

  const delLexiconMutation = useMutation({
    mutationFn: () =>
      currentLexicon !== undefined
        ? deleteLexicon(currentLexicon.id, dash?.session_id)
        : Promise.resolve(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me', 'lexicons'] })
    },
    onError: (err: Error) => {
      notifyer(err)
    },
  })

  return (
    <div className="w-full space-y-2.5 overflow-auto">
      <div className="flex w-full items-center justify-between space-x-2 overflow-auto p-1">
        <div className="flex flex-1 items-center space-x-2"></div>
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="default" variant="outline">
                <FeatherIcon iconName="plus" />
                Ajouter
              </Button>
            </DialogTrigger>
            <EditLexiconDialogContent mode="create" />
          </Dialog>
        </div>
      </div>

      <Table className="rounded-md border">
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
                  <strong>{lexicon.name}</strong>
                </TableCell>
                <TableCell>{lexicon.description}</TableCell>
                <TableCell>
                  <Link href={`/dashboard${lexicon.path}`}>{lexicon.slug}</Link>
                </TableCell>
                <TableCell>
                  <Switch checked={lexicon.is_private} disabled />
                </TableCell>
                <TableCell className="grid w-24 grid-cols-2 gap-1">
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
                  <Button
                    size="icon"
                    variant="outline"
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
          <Dialog
            onOpenChange={setEditOpen}
            open={isEditOpen}
            modal
            defaultOpen={isEditOpen}
          >
            <EditLexiconDialogContent lexicon={currentLexicon} mode="edit" />
          </Dialog>
          <AlertDialog
            onOpenChange={setDeleteOpen}
            open={isDeleteOpen}
            defaultOpen={isDeleteOpen}
          >
            <ConfirmDialogContent onAction={() => delLexiconMutation.mutate()} />
          </AlertDialog>
        </div>
      )}
    </div>
  )
}
