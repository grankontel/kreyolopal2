import { type ClassValue, clsx } from 'clsx'
import { SVGProps } from 'react'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function onlyUnique(value: any, index: number, self: string | any[]) {
  return self.indexOf(value) === index
}

export function funhash(s: string): number {
  for (var i = 0, h = 0xdeadbeef; i < s.length; i++)
    h = Math.imul(h ^ s.charCodeAt(i), 2654435761)
  return (h ^ (h >>> 16)) >>> 0
}

export const hashKey = (radix: string, item: string) => {
  return radix + btoa(funhash(item).toString())
}
