'use client'
import { Button } from '@/components/ui/button'
import { KreyolLanguage, IconAttributes } from '@kreyolopal/react-ui'
import { useDicoStore } from '@/store/dico-store'
import { useEffect, useState } from 'react'
import { useToast } from './ui/use-toast'

const apiServer = process.env.NEXT_PUBLIC_API_SERVER || 'https://api.kreyolopal.com'

export const EntryBookmarkButton = ({
  entry,
  bookmarked,
}: {
  entry: string
  bookmarked: boolean
}) => {
  const [isBookmarked, setBookmarked] = useState(bookmarked)
  const [isDisabled, setDisabled] = useState(true)
  const user = useDicoStore((state) => state.user)
  const { toast } = useToast()

  useEffect(() => {
    setDisabled(user == null || user.bearer == null)
  }, [user])

  const addBookmark = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    if (!user) return false

    const myHeaders = new Headers()
    myHeaders.set('Content-Type', 'application/json')

    if (user.bearer) myHeaders.set('Authorization', `Bearer ${user.bearer}`)

    return fetch(`/api/me/dictionary/${encodeURIComponent(entry)}`, {
      method: 'PUT',
      headers: myHeaders,
    })
      .then(
        async (result) => {
          if (result.ok) {
            setBookmarked(true)
            return true
          }

          return false
        },
        (reason) => {
          console.log(reason)
          toast({
            title: 'Erreur',
            variant: 'destructive',
            description: reason,
          })

          return false
        }
      )
      .catch((er) => {
        console.log(er)
        return false
      })
  }

  return (
    <Button size="icon" variant="outline" disabled={isDisabled} onClick={addBookmark}>
      {isBookmarked ? (
        <BookmarkedIcon className="h-6 w-6" />
      ) : (
        <BookmarkIcon className="h-6 w-6" />
      )}
    </Button>
  )
}

function BookmarkedIcon(props: IconAttributes) {
  return (
    <svg
      {...props}
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M3.5 2C3.22386 2 3 2.22386 3 2.5V13.5C3 13.6818 3.09864 13.8492 3.25762 13.9373C3.41659 14.0254 3.61087 14.0203 3.765 13.924L7.5 11.5896L11.235 13.924C11.3891 14.0203 11.5834 14.0254 11.7424 13.9373C11.9014 13.8492 12 13.6818 12 13.5V2.5C12 2.22386 11.7761 2 11.5 2H3.5Z"
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
      ></path>
    </svg>
  )
}

function BookmarkIcon(props: IconAttributes) {
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
      <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
    </svg>
  )
}
