'use client'

import * as React from 'react'
import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from 'cmdk'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { KreyolLanguage, MeaningLanguage } from '@kreyolopal/domain'
import { LangFlag } from '@kreyolopal/react-ui'

export interface LanguageComboboxProps<T = KreyolLanguage | MeaningLanguage> {
  kreyolOnly?: boolean
  value?: T
  onChange?: (value: T, previousValue?: T) => void
  allowed?: T[]
}

export function LanguageCombobox<T = KreyolLanguage | MeaningLanguage>({
  kreyolOnly,
  value,
  onChange,
  allowed,
}: LanguageComboboxProps<T>) {
  const [open, setOpen] = React.useState(false)

  const def_langues: Array<{ key: MeaningLanguage; value: string }> = [
    { key: 'gp', value: 'Gwadloup' },
    { key: 'mq', value: 'Matnik' },
    { key: 'ht', value: 'Ayiti' },
    { key: 'dm', value: 'Dominik' },
  ]

  if (!kreyolOnly) {
    def_langues.push({ key: 'fr', value: 'Français' })
  }

  const langues =
    allowed === undefined
      ? def_langues
      : def_langues.filter((item) => allowed?.includes(item.key))

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value ? (
            <>
              <LangFlag langue={value as MeaningLanguage} className="h-6 w-6 pr-1.5" />
              <span>{langues.find((item) => item.key === value)?.value}</span>
            </>
          ) : (
            'Choisir...'
          )}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command className="bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md">
          <CommandInput
            placeholder="Rechercher..."
            className="placeholder:text-muted-foreground flex h-10 h-9 w-full rounded-md bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50"
          />
          <CommandList className="max-h-[300px] overflow-y-auto overflow-x-hidden">
            <CommandEmpty className="py-6 text-center text-sm">
              Aucune nature trouvée.
            </CommandEmpty>
            <CommandGroup className="text-foreground [&_[cmdk-group-heading]]:text-muted-foreground overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium">
              {langues.map((item) => (
                //   '   aria-selected:bg-accent aria-selected:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50'
                <CommandItem
                  className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5  text-sm outline-none"
                  key={item.key}
                  value={item.key}
                  onSelect={(currentValue) => {
                    console.log(currentValue)
                    if (currentValue !== value) onChange?.(currentValue as T, value)
                    setOpen(false)
                  }}
                >
                  <LangFlag langue={item.key} className="h-6 w-6 pr-1.5" />
                  <span>{item.value}</span>
                  <CheckIcon
                    className={cn(
                      'ml-auto h-4 w-4',
                      value === item.key ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
