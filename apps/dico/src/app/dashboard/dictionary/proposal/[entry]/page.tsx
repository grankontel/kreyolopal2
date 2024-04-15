import { isLoggedIn } from '@/app/dashboard/is-logged-in'
import { BookmarkIcon } from '@/components/bookmark-icon'
import { KreyolCombobox } from '@/components/kreyol-combobox'
import { NatureCombobox } from '@/components/nature-combobox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export const runtime = 'edge'

export default async function Page({ params }: { params: { entry: string } }) {
  const token = isLoggedIn()
  if (!token) {
    return undefined
  }
  const { entry } = params

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 py-6">
        <div className="container space-y-6 px-4 md:px-6">
          <div className="grid  items-start gap-2">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              <span className="flex items-center gap-2">
                <BookmarkIcon className="h-6 w-6" />
                {entry}
              </span>
            </h1>

            <div className="grid gap-2 p-4 width-4/5 mx-auto border border-radius border-gray-200 dark:border-gray-700 border-solid">
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
                <KreyolCombobox />
              </div>

              <div className="grid grid-cols-5 items-center gap-4">
                <Label htmlFor="nature" className="text-left">
                  Nature
                </Label>
                <NatureCombobox />
              </div>

              <div className="grid grid-cols-5 items-center gap-4">

                <Label htmlFor='meaning' className='text-left'>
                  Définition
                </Label>
                <div className="col-span-4"
                >
<div className="grid grid-cols-4 items-center gap-1"> 

                  <KreyolCombobox />
                  <Input
                    className="col-span-3"
                    type="text"
                    name="meaning"
                    placeholder="Entrez la définition de l'entrée"
                  />
</div>
                </div>
              </div>

            </div>
          </div>
          <div className="above-article flex flex-row"></div>
        </div>
      </main>
    </div>
  )
}
