/**
 * This code was generated by v0 by Vercel.
 * @see https://v0.dev/t/maV7i2BnWwz
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */

/** Add fonts into your Next.js project:

import { Inter } from 'next/font/google'
import { Inter } from 'next/font/google'

inter({
  subsets: ['latin'],
  display: 'swap',
})

inter({
  subsets: ['latin'],
  display: 'swap',
})

To read more about using these font, please visit the Next.js documentation:
- App Directory: https://nextjs.org/docs/app/building-your-application/optimizing/fonts
- Pages Directory: https://nextjs.org/docs/pages/building-your-application/optimizing/fonts
**/
'use client'

import * as React from 'react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

const tagVariants = cva('rounded-full  px-2 py-0.5 text-sm ', {
  variants: {
    variant: {
      default: 'bg-gray-100 dark:bg-gray-800',
      primary: 'bg-primary text-primary-foreground',
      secondary: 'bg-secondary text-secondary-foreground',
      destructive: 'bg-red-500 text-white',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})
export interface TagProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tagVariants> {
  tag: string
  onDelete: () => void
}

export function Tag({ tag, onDelete, className, variant }: TagProps) {
  return (
    <div className={cn('relative', className)}>
      <span className={cn(tagVariants({ variant }))}>
        {tag}
        <button className="ml-1 flex-shrink-0 focus:outline-none" onClick={onDelete}>
          <XIcon className="h-3 w-3 text-gray-400 dark:text-gray-500" />
        </button>
      </span>
    </div>
  )
}

export interface TagsProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tagVariants> {
  tags: string[]
  removeTagAtIndex: (index: number) => void
  addTag: (tag: string) => Promise<boolean>
  isLoading?: boolean
  placeholder?: string
}

export function Tags(props: TagsProps) {
  const { tags, className, variant } = props
  const [newTag, setNewTag] = React.useState('')
  const placeholder = props.placeholder || 'Add a tag'
  return (
    <div className={cn('flex w-full flex-col', className)}>
      <div className="grid w-full items-center gap-1.5 rounded-lg border border-gray-200 p-1.5 dark:border-gray-800">
        <div className="flex flex-wrap items-center gap-1.5">
          {tags.map((tag, index) => (
            <Tag
              key={tag}
              variant={variant}
              tag={tag}
              onDelete={() => props.removeTagAtIndex(index)}
            />
          ))}
          <div className="relative ml-2 flex items-center">
            <Input
              className="w-full rounded-full px-2 py-0.5 text-sm text-gray-900 outline-none dark:text-gray-100"
              placeholder={placeholder}
              type="text"
              value={newTag}
              disabled={props.isLoading}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={async (e) => {
                if (e.key === 'Enter') {
                  if (await props.addTag(newTag)) {
                    setNewTag('')
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
      <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
        Tapez Entrée pour valider.
      </div>
    </div>
  )
}

function XIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 6 6 18" />
      <path d="m6 6 12 12" />
    </svg>
  )
}
