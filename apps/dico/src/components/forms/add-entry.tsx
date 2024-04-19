'use client'
import { useDashboard } from '@/app/dashboard/dashboard-provider'
import FeatherIcon from '@/components/FeatherIcon'
import { LanguageCombobox } from '@/components/language-combobox'
import { NatureCombobox } from '@/components/nature-combobox'
import { Tags } from '@/components/tags'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { checkWord } from '@/queries/check-word'
import { Quote, KreyolLanguage, Meaning, MeaningLanguage } from '@kreyolopal/domain'
import type { Nature } from '@kreyolopal/domain'
import { useState } from 'react'
import { useToast } from '../ui/use-toast'


interface LangDefinition {
  language: MeaningLanguage
  definition: string
}

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
  const auth = useDashboard()
  const { toast } = useToast()

  const [isChecking, setChecking] = useState(false)
  const [variations, setVariations] = useState<string[]>([])
  const [kreyol, setKreyol] = useState<KreyolLanguage>('gp')
  const [nature, setNature] = useState<Nature>('nom')
  const [meaning, setMeaning] = useState<LangDefinition[]>([{ language: 'fr', definition: '' }])
  const [usage, setUsage] = useState<string[]>([''])
  const [synonyms, setSynonyms] = useState<string[]>([])
  const [confer, setConfer] = useState<string[]>([])
  const [quotes, setQuotes] = useState<Quote[]>([])

  const var_regex = /^([a-z]([a-z-]|é|è|ò|à|)*,?)*$/gm
  const entry_regex = /^[a-z]([a-z-]|é|è|ò|à|)*$/gm

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

      {meaning.map((item, index) => (
        <div key={`meaning-${index}`} className="grid grid-cols-5 items-center gap-4">
          <Label htmlFor="meaning" className="text-left">
            Définition
          </Label>
          <div className="col-span-4">
            <div className="grid grid-cols-4 items-center gap-1">
              <LanguageCombobox value={meaning[index].language} onChange={(e) => setMeaning(meaning.map((_, i) => i === index ? { ...meaning[index], language: e } : meaning[i]))} />
              <div className="col-span-3 flex w-full items-center space-x-2">
                <Input
                  type="text"
                  name="meaning"
                  placeholder={`Entrez la définition de ${entry} en ${meaning[index].language} `}
                  value={meaning[index].definition}
                  onChange={(e) => setMeaning(meaning.map((_, i) => i === index ? { ...meaning[index], definition: e.target.value } : meaning[i]))}
                />
                <Button size="icon" variant="outline" className="h-8 w-8"
                  onClick={() => {
                    if (meaning[index].definition.length > 3)
                      setMeaning([...meaning, { language: 'gp', definition: '' }])
                  }
                  }
                >
                  <FeatherIcon iconName="plus" />
                </Button>
              </div>
            </div>
          </div>
        </div>

      ))}

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

    </div>
  )
}
