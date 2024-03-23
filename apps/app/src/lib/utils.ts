import { type ClassValue, clsx } from "clsx"
import { SVGProps } from "react"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type IconAttributes = JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>