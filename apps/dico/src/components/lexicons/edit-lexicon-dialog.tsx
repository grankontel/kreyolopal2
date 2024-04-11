'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Lexicon } from '@/lib/lexicons/types'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useDashboard } from '@/app/dashboard/dashboard-provider'
import { putLexicon, postLexicon } from '@/queries/put-lexicon'

var slugify = require('slugify')

export function EditLexiconDialog({
  trigger,
  lexicon,
}: {
  trigger: React.ReactNode
  lexicon: Lexicon
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <EditLexiconDialogContent lexicon={lexicon} mode='edit' />
    </Dialog>
  )
}

type EditLexiconDialogProps = {
  lexicon: Lexicon
  mode: "edit"
} | {
  lexicon?: undefined
  mode: "create"
} 

export const EditLexiconDialogContent = ({ lexicon, mode = "edit" }: EditLexiconDialogProps) => {
  const [name, setName] = useState(lexicon?.name || '')
  const [slug, setSlug] = useState(lexicon?.slug || '')
  const [desc, setDesc] = useState(lexicon?.description || '')
  const [isPrivate, setPrivate] = useState(lexicon?.is_private  || false)
  const [hasCustomSlug, setCustomSlug] = useState(false)
  const dash = useDashboard()
  const queryClient = useQueryClient()

  const editLexiconMutation = useMutation({
    mutationFn: () =>
      mode === 'edit' ? putLexicon(
        lexicon?.id as string,
        { name, slug, description: desc, is_private: isPrivate },
        dash?.session_id
      ) : postLexicon(
        { name, slug, description: desc, is_private: isPrivate },
        dash?.session_id
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me', 'lexicons'] })
    },
  })

  const changeName = (value: string) => {
    setName(value)
    if (!hasCustomSlug) {
      setSlug(slugify(value.toLowerCase()))
    }
  }

  const changeSlug = (value: string) => {
    const rvalue = slugify(value.toLowerCase())
    setSlug(rvalue)
    setCustomSlug(rvalue.length > 0)
  }

  const resetSlug = () => {
    if (slug.length === 0) setSlug(slugify(name.toLowerCase()))
  }

  const handleSubmit = (e: any) => {
    editLexiconMutation.mutate()
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Editer le lexique</DialogTitle>
        <DialogDescription>Etes vous sûr de vouloir vous déconnecter ?</DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Nom
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => changeName(e.target.value)}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="slug" className="text-right">
            Slug
          </Label>
          <Input
            id="slug"
            value={slug}
            onChange={(e) => changeSlug(e.target.value)}
            onBlur={() => resetSlug()}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="description" className="text-right">
            Description
          </Label>
          <Input
            id="description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="is_private" className="text-right">
            Privé ?
          </Label>
          <Switch id="is_private" checked={isPrivate} onCheckedChange={setPrivate} />
        </div>
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button
            variant="logo"
            loading={editLexiconMutation.isPending}
            onClick={handleSubmit}
          >
            Sauvegarder
          </Button>
        </DialogClose>

        <DialogClose asChild>
          <Button variant="default">Abandonner</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  )
}
