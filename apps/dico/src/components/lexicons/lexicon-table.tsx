'use client'
import MainPanel from '@/components/dashboard/main-panel'
import { isLoggedIn } from '../is-logged-in'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { useDicoStore } from '@/store/dico-store'
import Link from 'next/link'
import { Switch } from '../ui/switch'

export const LexiconTable = () => {
  const { lexicons } = useDicoStore()

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-12">Select</TableHead>
          <TableHead>Nom</TableHead>
          <TableHead>Description</TableHead>
          <TableHead>Slug</TableHead>
          <TableHead>Privé ?</TableHead>
          <TableHead className="w-12">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {lexicons.map((lexicon) => {
          return (
            <TableRow key={lexicon.id}>
              <TableCell className="w-12">
                <Checkbox />
              </TableCell>
              <TableCell>{lexicon.name}</TableCell>
              <TableCell>{lexicon.description}</TableCell>
              <TableCell>
                <Link href={`/dashboard${lexicon.path}`}>{lexicon.slug}</Link>
              </TableCell>
              <TableCell>
                <Switch checked={lexicon.is_private} disabled />
              </TableCell>
              <TableCell className="w-12">
                <Button size="icon" variant="outline">
                  <MoreHorizontalIcon className="h-4 w-4" />
                  <span className="sr-only">Actions</span>
                </Button>
              </TableCell>
            </TableRow>
          )
        })}
      </TableBody>
    </Table>
  )
}

function MoreHorizontalIcon(props) {
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
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  )
}
