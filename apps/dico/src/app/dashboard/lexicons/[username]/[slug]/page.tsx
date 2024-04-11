import { notFound } from 'next/navigation'
import { isLoggedIn } from '@/app/dashboard/is-logged-in'

export const runtime = 'edge'

export default async function Page({
  params,
}: {
  params: { username: string; slug: string }
}) {
  const token = isLoggedIn()
  if (!token) {
    return undefined
  }

  const data = true

  if (!data) {
    return notFound()
  }
  return (
		<div>{params.username} / {params.slug}</div>
  )
}
