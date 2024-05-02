'use client'

import { useState } from 'react'
import { EntryDefinition } from './entry-definition'
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SingleDefinition, ProposalDefinition, KreyolLanguage } from '@kreyolopal/domain'
import { hashKey } from '@/lib/utils'

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
import { useToast } from '@/components/ui/use-toast'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

interface EntryDefinitionAndFormProps {
	entry: string
	kreyol: KreyolLanguage
	definitions: SingleDefinition[] | ProposalDefinition[]
	variations?: string[]

}

export const EntryDefinitionAndForm = ({
	entry,
	kreyol,
	definitions,
	variations = [],
}: EntryDefinitionAndFormProps) => {
	const [selected, setSelected] = useState<string[]>([])
	const [pending, setPending] = useState<boolean>(false)

	const checkChanged = (checked: string | boolean, definition_id: string) => {
		if (!checked) {
			setSelected(selected.filter(id => id !== definition_id))
		} else {
			setSelected([...selected, definition_id])
		}
	}

	return (
		<div>
			{definitions.map((definition, index) => (

				<div key={hashKey('key_', entry + ':' + index)}
					className="flex flex-row gap-2">
					<div className="flex py-6">
						<Checkbox
							checked={selected.includes(definition.definition_id)}
							onCheckedChange={(checked) => checkChanged(checked, definition.definition_id)}
						/>
					</div>
					<div className="flex-1">
						<EntryDefinition
							entry={entry}
							kreyol={kreyol}
							index={index + 1}
							definition={definition}
						/>

					</div>
				</div>
			))}
			<div className="grid grid-cols-5  gap-4 py-2">
				<Dialog>
					<DialogTrigger asChild>
						<Button
							type="submit"
							className="col-span-2 col-end-6"
							variant="logo"
							loading={pending}
							disabled={selected.length === 0}
							aria-disabled={pending}
						>
							Valider
						</Button>

					</DialogTrigger>
					<ValidateDialogContent entry={entry} variations={variations} definitions={selected} />
				</Dialog>

			</div>
		</div>
	)
}

interface ValidateDialogContentProps {
	entry: string
	definitions: string[]
	variations: string[]

}

export const ValidateDialogContent = ({entry, definitions, variations: defaultVariations}: ValidateDialogContentProps) => {
  const [variations, setVariations] = useState<string[]>(defaultVariations)
  const router = useRouter()
  const { toast } = useToast()
  const notifyer = (err: { error?: string; toString: () => string }) => {
    toast({
      title: 'Erreur',
      variant: 'destructive',
      description: err?.error || err.toString(),
    })
  }

	const var_regex = /^([a-z]([a-z-]|é|è|ò|à|)*,?)*$/gm
  if (!variations.includes(entry)) setVariations([entry, ...variations])

	const validateEntry = useMutation({
    onSuccess: () => {
      toast({
        variant: 'default',
        description: 'Entrée ajoutée',
      })
      router.refresh()
    },
    onError: (err: Error) => {
      notifyer(err)
    },
	})
	const submitHandler = async () => {

		console.log('submitHandler', entry, variations, definitions)
	}
  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Valider</DialogTitle>
        <DialogDescription>Voulez-vous valider ces définitions ?</DialogDescription>
      </DialogHeader>
			<div className="grid grid-cols-5 items-center gap-4 text-gray-500 dark:text-gray-400">
        <Label htmlFor="variations" className="text-left">
          Variations
        </Label>
        <Input
          className="col-span-4"
          type="text"
          name="variations"
          value={variations.join(',')}
          onChange={(e) => {
            if (var_regex.test(e.target.value)) {
              setVariations(e.target.value.split(','))
            }
          }}
          placeholder={`entrez les différentes façon d'écrire ${entry}`}
        />
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button
            variant="logo"
            onClick={submitHandler}
          >
            Yes
          </Button>
        </DialogClose>

        <DialogClose asChild>
          <Button variant="default">No</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  )
}
