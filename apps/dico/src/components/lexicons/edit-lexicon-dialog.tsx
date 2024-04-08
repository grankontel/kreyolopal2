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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from '@/components/ui/switch'
import { Lexicon } from '@/lib/lexicons/types'
import { useState } from 'react'
var slugify = require('slugify')

export function EditLexiconDialog({ trigger, lexicon }: { trigger: React.ReactNode, lexicon:Lexicon }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <EditLexiconDialogContent lexicon={lexicon} />
    </Dialog>
  )
}

export const EditLexiconDialogContent = ({lexicon}: {lexicon: Lexicon}) => {
    const [name, setName] = useState(lexicon.name)
    const [slug, setSlug] = useState(lexicon.slug)
    const [desc, setDesc] = useState(lexicon.description)
    const [isPrivate, setPrivate] = useState(lexicon.is_private)
    const [hasCustomSlug, setCustomSlug] = useState(false)

    const changeName = (value:string) =>{
      setName(value)
      if (!hasCustomSlug) {
        setSlug(slugify(value.toLowerCase()))
      }
    }

    const changeSlug = (value:string) =>{
      const rvalue = slugify(value.toLowerCase())
      setSlug(rvalue)
      setCustomSlug(rvalue.length > 0)
    }

    const resetSlug = () => {
      if (slug.length === 0)
        setSlug(slugify(name.toLowerCase()))

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
            <Input id="name" value={name} defaultValue={lexicon.name} onChange={(e) => changeName(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="slug" className="text-right">
              Slug
            </Label>
            <Input id="name" value={slug} onChange={(e) => changeSlug(e.target.value)} onBlur={() => resetSlug()}  className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input id="name" value={desc} onChange={(e)=> setDesc(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="is_private" className="text-right">
              Privé ?
            </Label>
            <Switch checked={isPrivate} onCheckedChange={setPrivate} />

          </div>
        </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button
            variant="logo"
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
