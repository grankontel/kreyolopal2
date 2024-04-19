import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { IconAttributes } from '@kreyolopal/react-ui'

function BellIcon(props: IconAttributes) {
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
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  )
}

export default function Sidebar({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <aside className="sidebar hidden border-r bg-gray-100/40 lg:block dark:bg-gray-800/40">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="bg-logo flex h-[60px] items-center border-b px-6">
          <Link className="flex items-center gap-2 font-semibold" href="#">
            <Image
              src="/images/logo_name-transparent.svg"
              width={182}
              height={50}
              alt="Zakari Brand"
            />
          </Link>
          <Button className="ml-auto h-8 w-8" size="icon" variant="outline">
            <BellIcon className="h-4 w-4" />
            <span className="sr-only">Toggle notifications</span>
          </Button>
        </div>
        {children}
      </div>
    </aside>
  )
}
