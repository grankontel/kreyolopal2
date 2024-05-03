'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import {
  Quote,
  KreyolLanguage,
  LanguageArray,
  Meaning,
  MeaningLanguage,
  sanitizeSubmitEntry,
} from '@kreyolopal/domain'
import FeatherIcon from '@/components/FeatherIcon'
import { Tags } from '@/components/tags'
import { LanguageCombobox } from '@/components/language-combobox'
import { NatureCombobox } from '@/components/nature-combobox'
import { checkWord } from '@/queries/check-word'
import { useDashboard } from '@/components/dashboard/dashboard-provider'
import { useMutation } from '@tanstack/react-query'
import { postProposal } from '@/queries/proposals/post-proposal'
import type { Nature, SubmitEntry } from '@kreyolopal/domain'

interface LangDefinition {
  language: MeaningLanguage
  definition: string
}

export const AddEntry = ({ entry }: { entry: string }) => {
  const auth = useDashboard()
  const router = useRouter()
  const { toast } = useToast()

  const [isChecking, setChecking] = useState(false)
  const [pending, setPending] = useState(false)

  const [variations, setVariations] = useState<string[]>([])
  const [kreyol, setKreyol] = useState<KreyolLanguage>('gp')
  const [nature, setNature] = useState<Nature>('nom')
  const [meaning, setMeaning] = useState<LangDefinition[]>([
    { language: 'fr', definition: '' },
  ])
  const [usage, setUsage] = useState<string[]>([''])
  const [synonyms, setSynonyms] = useState<string[]>([])
  const [confer, setConfer] = useState<string[]>([])
  const [quotes, setQuotes] = useState<Quote[]>([])

  const notifyer = (err: { error?: string; toString: () => string }) => {
    toast({
      title: 'Erreur',
      variant: 'destructive',
      description: err?.error || err.toString(),
    })
  }

  const addEntryMutation = useMutation({
    mutationFn: (newEntry: SubmitEntry) => {
      return postProposal(auth?.session_id || '', newEntry)
    },
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

  const var_regex = /^([a-z]([a-z-]|é|è|ò|à|)*,?)*$/gm
  const entry_regex = /^[a-z]([a-z-]|é|è|ò|à|)*$/gm

  const usedLanguages: MeaningLanguage[] = []

  function removeConferAtIndex(index: number): void {
    setConfer(confer.filter((_, i) => i !== index))
  }

  async function addConfer(tag: string): Promise<boolean> {
    // make sure the word exists
    setChecking(true)
    const result = await checkWord(auth?.session_id || '', tag)
    setChecking(false)
    if (!result) {
      toast({
        title: 'Erreur',
        variant: 'destructive',
        description: `Le mot ${tag} n'est pas dans le dictionnaire`,
      })

      return false
    }

    setConfer([...confer, tag])
    return true
  }

  function removeSynonymAtIndex(index: number): void {
    setSynonyms(synonyms.filter((_, i) => i !== index))
  }

  async function addSynonym(tag: string): Promise<boolean> {
    // make sure the word exists
    setChecking(true)
    const result = await checkWord(auth?.session_id || '', tag)
    setChecking(false)
    if (!result) {
      toast({
        title: 'Erreur',
        variant: 'destructive',
        description: `Le mot ${tag} n'est pas dans le dictionnaire`,
      })

      return false
    }

    setSynonyms([...synonyms, tag])
    return true
  }

  const submitHandler = async (event: Event) => {
    event.preventDefault()
    setPending(true)

    //verify data (meaning, usage)
    let meaningObj: Meaning = {}
    meaning
      .filter((item) => item.definition.length > 2)
      .forEach((item) => {
        meaningObj[item.language] = item.definition
      })

    let anEntry = {
      entry,
      variations,
      definitions: [
        {
          kreyol,
          nature: [nature],
          meaning: meaningObj,
          usage: usage.filter((item) => item.length > 2),
          synonyms,
          confer,
          quotes,
        },
      ],
    }

    const newEntry = sanitizeSubmitEntry(anEntry)
    console.log(JSON.stringify(newEntry))

    addEntryMutation.mutate(newEntry)
    setPending(false)
  }

  return (
    <div className="width-4/5 border-radius mx-auto grid gap-2 border border-solid border-gray-200 p-4 dark:border-gray-700">
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

      <div className="grid grid-cols-5 items-center gap-4">
        <Label htmlFor="kreyol" className="text-left">
          Kreyol
        </Label>
        <LanguageCombobox kreyolOnly value={kreyol} onChange={setKreyol} />
      </div>

      <div className="grid grid-cols-5 items-center gap-4">
        <Label htmlFor="nature" className="text-left">
          Nature
        </Label>
        <NatureCombobox value={nature} onChange={setNature} />
      </div>

      {meaning.map((item, index) => {
        const value = (
          <div key={`meaning-${index}`} className="grid grid-cols-5 items-center gap-4">
            <Label htmlFor="meaning" className="text-left">
              Définition
            </Label>
            <div className="col-span-4">
              <div className="grid grid-cols-4 items-center gap-1">
                {index === 0 ? (
                  <LanguageCombobox
                    value={meaning[index].language}
                    onChange={(e, prev) => {
                      setMeaning(
                        meaning.map((_, i) =>
                          i === index ? { ...meaning[index], language: e } : meaning[i]
                        )
                      )
                    }}
                  />
                ) : (
                  <LanguageCombobox
                    value={meaning[index].language}
                    onChange={(e, prev) => {
                      setMeaning(
                        meaning.map((_, i) =>
                          i === index ? { ...meaning[index], language: e } : meaning[i]
                        )
                      )
                    }}
                    allowed={LanguageArray.filter(
                      (item: MeaningLanguage) => !usedLanguages.includes(item)
                    )}
                  />
                )}
                <div className="col-span-3 flex w-full items-center space-x-2">
                  <Input
                    type="text"
                    name="meaning"
                    placeholder={`Entrez la définition de ${entry} en ${meaning[index].language} `}
                    value={meaning[index].definition}
                    onChange={(e) =>
                      setMeaning(
                        meaning.map((_, i) =>
                          i === index
                            ? {
                                ...meaning[index],
                                definition: e.target.value.toLowerCase(),
                              }
                            : meaning[i]
                        )
                      )
                    }
                  />
                  {usedLanguages.length < LanguageArray.length - 1 ? (
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-8 w-8"
                      onClick={() => {
                        const remaining = LanguageArray.filter(
                          (item: MeaningLanguage) => !usedLanguages.includes(item)
                        )
                        if (meaning[index].definition.length > 3 && remaining.length > 0)
                          setMeaning([
                            ...meaning,
                            { language: remaining[0], definition: '' },
                          ])
                      }}
                    >
                      <FeatherIcon iconName="plus" />
                    </Button>
                  ) : (
                    ''
                  )}
                </div>
              </div>
            </div>
          </div>
        )
        usedLanguages.push(item.language)

        return value
      })}

      {usage.map((item, index) => (
        <div key={`usage-${index}`} className="grid grid-cols-5 items-center gap-4">
          <Label htmlFor="usage" className="text-left">
            Usage
          </Label>{' '}
          <div className="col-span-4 flex w-full items-center space-x-2">
            <Input
              type="text"
              name="usage"
              placeholder={`entrez une phrase d'usage avec ${entry}`}
              value={usage[index]}
              onChange={(e) => {
                setUsage([
                  ...usage.slice(0, index),
                  e.target.value,
                  ...usage.slice(index + 1),
                ])
              }}
            />
            {index !== usage.length - 1 ? null : (
              <Button
                size="icon"
                variant="outline"
                className="h-8 w-8"
                onClick={() => {
                  if (usage[index].length > 3) setUsage([...usage, ''])
                }}
              >
                <FeatherIcon iconName="plus" />
              </Button>
            )}
          </div>
        </div>
      ))}

      <div className="grid grid-cols-5 items-center gap-4">
        <Label htmlFor="synonyms" className="text-left">
          Synonymes
        </Label>
        <Tags
          className="col-span-4"
          variant="default"
          tags={synonyms}
          addTag={addSynonym}
          removeTagAtIndex={removeSynonymAtIndex}
          placeholder="Ajouter un synonyme"
          isLoading={isChecking}
        />
      </div>

      <div className="grid grid-cols-5 items-center gap-4">
        <Label htmlFor="conver" className="text-left">
          Voir aussi
        </Label>
        <Tags
          className="col-span-4"
          variant="default"
          tags={confer}
          addTag={addConfer}
          removeTagAtIndex={removeConferAtIndex}
          placeholder="Ajouter une référence"
          isLoading={isChecking}
        />
      </div>

      <div className="grid grid-cols-5  gap-4">
        <Button
          type="submit"
          className="col-span-2 col-end-6"
          variant="logo"
          loading={pending}
          aria-disabled={pending}
          onClick={(e: any) => submitHandler(e)}
        >
          Ajouter
        </Button>
      </div>
    </div>
  )
}
