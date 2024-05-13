import Link from 'next/link'

const HomeFooter = () => (
    <footer className="flex w-full shrink-0 flex-col items-center gap-2 border-t px-4 py-6 sm:flex-row md:px-6">
    <p className="text-xs text-gray-500 dark:text-gray-400">
      &copy; 2024 Kreyolopal. All rights reserved.
    </p>
    <nav className="flex gap-4 sm:ml-auto sm:gap-6">
      <Link className="text-xs underline-offset-4 hover:underline" href="/pages/legal-notice">
        Terms of Service
      </Link>
      <Link className="text-xs underline-offset-4 hover:underline" href="#">
        Privacy Policy
      </Link>
      <Link className="text-xs underline-offset-4 hover:underline" href="#">
        Contact Us
      </Link>
    </nav>
  </footer>

)

export default HomeFooter