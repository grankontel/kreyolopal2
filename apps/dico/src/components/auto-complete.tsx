import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export const AutoComplete = ({ ...props }) => {
  return (
    <div className="relative">
      <Input {...props} />
      <div className="absolute left-0 top-full z-10 mt-2 w-full bg-white shadow-lg">
        <ul className="divide-y divide-gray-200">
          <li>
            <Button className="w-full justify-start text-left" variant="ghost">
              Suggestion 1
            </Button>
          </li>
          <li>
            <Button className="w-full justify-start text-left" variant="ghost">
              Suggestion 2
            </Button>
          </li>
          <li>
            <Button className="w-full justify-start text-left" variant="ghost">
              Suggestion 3
            </Button>
          </li>
        </ul>
      </div>
    </div>
  )
}
