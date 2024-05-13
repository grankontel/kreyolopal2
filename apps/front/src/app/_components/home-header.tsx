import Link from 'next/link'

const Logo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 520 520"
    {...props}
  >
    <path d="M42 25.4c-14.5 4.1-25.7 15.4-29.6 30-2 7.5-2.1 398.6 0 406.1 4 15 15.1 26.1 30 30.1 4.1 1.1 20.4 1.4 84.4 1.4H206V24l-79.7.1c-60.6.1-80.9.4-84.3 1.3zM295 152.6c0 70.7.4 128.4.9 128.2.4-.2 23.9-27.5 52.2-60.6l51.4-60.4 52.8.1 52.7.1v-49.7c0-54-.1-55.3-5.6-65.3-3.2-5.8-10.7-13.1-16.8-16.2-9.4-4.8-8.8-4.8-100.8-4.8H295v128.6zM464.5 207c-21.9 25.6-48.3 56.2-58.5 68-10.2 11.8-19.1 22.3-19.8 23.2-1.2 1.5 4.4 10.2 47.4 74 26.8 39.8 52.8 78.1 57.7 85.2 14.7 21.1 13.9 30.6 13.5-149.9l-.3-146.9-40 46.4zM311.7 375.8 296 391.5V493h58c31.9 0 58-.3 58-.6 0-.6-82.5-130.1-83.9-131.6-.4-.4-7.7 6.3-16.4 15z" />
  </svg>
)


const HomeHeader = () => (
  <header className="flex h-14 items-center px-4 lg:px-6">
    <Link className="flex items-center justify-center" href="#">
      <Logo className="h-6 w-6" />
      <span className="sr-only">Kreyolopal</span>
    </Link>
    <nav className="ml-auto flex gap-4 sm:gap-6">
      <Link
        className="text-sm font-medium underline-offset-4 hover:underline"
        href="/#features"
      >
        Features
      </Link>
      <Link className="text-sm font-medium underline-offset-4 hover:underline" href="#">
        Pricing
      </Link>
      <Link className="text-sm font-medium underline-offset-4 hover:underline" href="/#team">
        L'équipe
      </Link>
      <Link className="text-sm font-medium underline-offset-4 hover:underline" href="https://dico.kreyolopal.com/contact">
        Nous contacter
      </Link>
    </nav>
  </header>
)

export default HomeHeader