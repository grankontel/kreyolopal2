import { permanentRedirect } from 'next/navigation'

export default function Home() {
  permanentRedirect(process.env.NEXT_PUBLIC_FRONT_URL || 'https://www.kreyolopal.com')
}
