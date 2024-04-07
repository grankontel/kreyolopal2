import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export const AutoComplete = ({ ...props }) => {
  return (
    <div className="relative">
      <Input {...props} />
      <div className="absolute top-full left-0 w-full bg-white mt-2 shadow-lg z-10">
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
