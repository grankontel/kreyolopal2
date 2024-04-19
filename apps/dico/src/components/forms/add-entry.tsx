'use client'
import FeatherIcon from '@/components/FeatherIcon'
import { LanguageCombobox } from '@/components/language-combobox'
import { NatureCombobox } from '@/components/nature-combobox'
import { Tags } from '@/components/tags'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export const AddEntry = ({ entry }: { entry: string }) => {
  const synonyms: string[] = []

  function removeSynonymAtIndex(index: number): void {
    synonyms.splice(index, 1)
  }

  function addSynonym(tag: string): boolean {
    synonyms.push(tag)
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
          placeholder={`entrez les différentes façon d'écrire ${entry}`}
        />
      </div>

      <div className="grid grid-cols-5 items-center gap-4">
        <Label htmlFor="kreyol" className="text-left">
          Kreyol
        </Label>
        <LanguageCombobox kreyolOnly />
      </div>

      <div className="grid grid-cols-5 items-center gap-4">
        <Label htmlFor="nature" className="text-left">
          Nature
        </Label>
        <NatureCombobox />
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
                placeholder="Entrez la définition de l'entrée"
              />
              <Button size="icon" variant="outline" className="h-8 w-8">
                <FeatherIcon iconName="plus" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 items-center gap-4">
        <Label htmlFor="usage" className="text-left">
          Usage
        </Label>
        <Input
          className="col-span-4"
          type="text"
          name="usage"
          placeholder={`entrez une phrase d'usage avec ${entry}`}
        />
      </div>

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
        />
      </div>
    </div>
  )
}
