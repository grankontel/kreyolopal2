'use client'
import FeatherIcon from '@/components/FeatherIcon'
import { LanguageCombobox } from '@/components/language-combobox'
import { NatureCombobox } from '@/components/nature-combobox'
import { Tags } from '@/components/tags'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Quote, KreyolLanguage, Meaning } from '@kreyolopal/domain'
import type { Nature } from '@kreyolopal/domain'
import { useState } from 'react'

export interface SubmitEntry {
  entry: string
  variations: string[]
  definitions: Array<SubmitDefinition>
}

export interface SubmitDefinition {
  kreyol: KreyolLanguage
  nature: Nature[]
  meaning: Meaning
  usage: string[]
  synonyms: string[]
  confer: string[]
  quotes: Quote[]
}


export const AddEntry = ({ entry }: { entry: string }) => {
  const [variations, setVariations] = useState<string[]>([])
  const [kreyol, setKreyol] = useState<KreyolLanguage>('gp')
  const [nature, setNature] = useState<Nature>('nom')
  const [meaning, setMeaning] = useState<Meaning>({})
  const [usage, setUsage] = useState<string[]>([''])
  const [synonyms, setSynonyms] = useState<string[]>([])
  const [confer, setConfer] = useState<string[]>([])
  const [quotes, setQuotes] = useState<Quote[]>([])

  const var_regex = /^([a-z]([a-z-]|é|è|ò|à|)*,?)*$/gm
  const entry_regex = /^[a-z]([a-z-]|é|è|ò|à|)*$/gm

  function removeConferAtIndex(index: number): void {
    setConfer(confer.filter((_, i) => i !== index))
  }

  function addConfer(tag: string): boolean {
    // make sure the word exists
    setConfer([...confer, tag])
    return true
  }

  function removeSynonymAtIndex(index: number): void {
    setSynonyms(synonyms.filter((_, i) => i !== index))
  }

  function addSynonym(tag: string): boolean {
    // make sure the word exists
    setSynonyms([...synonyms, tag])
    return true
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
          }
          }
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

      <div className="grid grid-cols-5 items-center gap-4">
        <Label htmlFor="meaning" className="text-left">
          Définition
        </Label>
        <div className="col-span-4">
          <div className="grid grid-cols-4 items-center gap-1">
            <LanguageCombobox />
            <div className="col-span-3 flex w-full items-center space-x-2">
              <Input
                type="text"
                name="meaning"
                placeholder={`Entrez la définition de ${entry} en `}
              />
              <Button size="icon" variant="outline" className="h-8 w-8">
                <FeatherIcon iconName="plus" />
              </Button>
            </div>
          </div>
        </div>
      </div>

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
                setUsage([...usage.slice(0, index), e.target.value, ...usage.slice(index + 1)])
              }}
            />
            {(index !== usage.length - 1) ? null : (
              <Button size="icon" variant="outline" className="h-8 w-8"
                onClick={() => {
                  if (usage[index].length > 3)
                    setUsage([...usage, ''])
                }
                }
              >
                <FeatherIcon iconName="plus" />
              </Button>)}
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
        />
      </div>

    </div>
  )
}
