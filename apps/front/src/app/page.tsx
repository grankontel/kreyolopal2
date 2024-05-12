import ImageSet from '@/components/image-set'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

import { SVGProps } from 'react'
const MountainIcon = (props: SVGProps<SVGSVGElement>) => (
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

const LearnMore = () => {
  return (
    <Link
      className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 border-gray-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
      href="#"
    >
      Learn More
    </Link>
  )
}
const StartFreeTrial = () => {
  return (
    <Link
      className="inline-flex h-10 items-center justify-center rounded-md bg-gray-900 px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
      href="#"
    >
      Start Free Trial
    </Link>
  )
}
const CheckIcon = (props: SVGProps<SVGSVGElement>) => (
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
    <path d="M20 6 9 17l-5-5" />
  </svg>
)

const HomeSection = ({
  children,
  className,
}: Readonly<{
  children: React.ReactNode
  className?: string
}>) => {
  return (
    <section className={cn('w-full py-6 md:py-12 lg:py-24 xl:py-32', className)}>
      {children}
    </section>
  )
}

export default function Home() {
  return (
    <main className="flex min-h-[100dvh] flex-col">
      <header className="flex h-14 items-center px-4 lg:px-6">
        <Link className="flex items-center justify-center" href="#">
          <MountainIcon className="h-6 w-6" />
          <span className="sr-only">Kreyolopal</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Link
            className="text-sm font-medium underline-offset-4 hover:underline"
            href="#features"
          >
            Features
          </Link>
          <Link
            className="text-sm font-medium underline-offset-4 hover:underline"
            href="#"
          >
            Pricing
          </Link>
          <Link
            className="text-sm font-medium underline-offset-4 hover:underline"
            href="#"
          >
            About
          </Link>
          <Link
            className="text-sm font-medium underline-offset-4 hover:underline"
            href="#"
          >
            Contact
          </Link>
        </nav>
      </header>
      <HomeSection className="py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Rejoignez la communauté Kreyolopal
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                Utiliser les technologies d&apos;aujourd&apos;hui pour encourager,
                améliorer et diffuser l&apos;écriture du créole.
              </p>
            </div>
            <div className="space-x-4">
              <StartFreeTrial />
              <LearnMore />
            </div>
          </div>
        </div>
      </HomeSection>

      <HomeSection className=" bg-gray-100  dark:bg-gray-800">
        <div className="container px-4 md:px-6">
          <div className="grid items-center gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_550px]">
            <img
              alt="Features"
              className="mx-auto aspect-video overflow-hidden rounded-xl object-cover object-center sm:w-full lg:order-last"
              height="310"
              src="/images/black_peoples.jpeg"
              width="550"
            />
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-gray-100 px-3 py-1 text-sm dark:bg-gray-800">
                  Fonctionnalités principales
                </div>
                <h2
                  id="features"
                  className="text-3xl font-bold tracking-tighter sm:text-5xl"
                >
                  Un dictionnaire en ligne
                </h2>
                <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                  La nouvelle édition du dictionnaire Créole-Français revue et corrigée
                  par Hector Poullet.
                </p>
              </div>
              <ul className="grid gap-2 py-4">
                <li>
                  <CheckIcon className="mr-2 inline-block h-4 w-4" />
                  Définitions, synonymes, phrases d&apos;usage... entièrement revu !
                </li>
                <li>
                  <CheckIcon className="mr-2 inline-block h-4 w-4" />
                  Constituez vos propres lexiques thématiques
                </li>
                <li>
                  <CheckIcon className="mr-2 inline-block h-4 w-4" />
                  Contribuez à enrichier le dictionnaire
                </li>
                <li>
                  <CheckIcon className="mr-2 inline-block h-4 w-4" />
                  Déjà près de 20 000 définitions.
                </li>
              </ul>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <StartFreeTrial />
                <LearnMore />
              </div>
            </div>
          </div>
        </div>
      </HomeSection>

      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="flex flex-col items-center space-y-2 space-y-4 px-4 py-4 text-center md:px-6">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
            L&apos;équipe
          </h2>
          <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            Our all-in-one SaaS platform offers a suite of powerful tools to streamline
            your business operations, enhance collaboration, and drive growth.
          </p>
        </div>
        <div className="container grid grid-cols-1 gap-8 px-4 md:grid-cols-3 md:px-6">
          <div className="flex flex-col items-center space-y-4 rounded-lg bg-gray-100 p-6 dark:bg-gray-800">
            <img
              alt="Hector Poullet"
              className="h-30 w-30 rounded-full object-cover"
              height={120}
              src="/images/h_poullet.png"
              style={{
                aspectRatio: '120/120',
                objectFit: 'cover',
              }}
              width={120}
            />
            <div className="space-y-2 text-center">
              <h3 className="text-lg font-semibold">Hector Poullet</h3>
              <p className="text-gray-500 dark:text-gray-400">Lexicographe</p>
              <p className="text-sm">
                Hector Poullet est lexicographe et auteur de Guadeloupe. Il est connu pour
                le &ldquo;Dictionnaire français-créole&rdquo;, Le Déterville :
                Dictionnaire Français-Créole, ainsi que de nombreux lexiques thématiques
                et traductions vers le créole.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center space-y-4 rounded-lg bg-gray-100 p-6 dark:bg-gray-800">
            <img
              alt="Jean-Christophe Maillard"
              className="h-30 w-30 rounded-full object-cover"
              height={120}
              src="/images/jc_maillard.png"
              style={{
                aspectRatio: '120/120',
                objectFit: 'cover',
              }}
              width={120}
            />
            <div className="space-y-2 text-center">
              <h3 className="text-lg font-semibold">Jean-Christophe Maillard</h3>
              <p className="text-gray-500 dark:text-gray-400">Auteur-Compositeur</p>
              <p className="text-sm">
                Jean-Cristophe Maillard, est un guitariste, auteur-compositeur et
                producteur de Guadeloupe. Auteur de quatres albums solos, il a collaboré
                avec de nombreux artistes créolophones, parmi lesquels Jocelyne Béroard,
                Tanya Saint-Val, Patrick Saint-Eloi, Mario Canonge, Beethova Obas, et
                Emeline Michel.
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center space-y-4 rounded-lg bg-gray-100 p-6 dark:bg-gray-800">
            <img
              alt="TiMalo"
              className="h-30 w-30 rounded-full object-cover"
              height={120}
              src="/images/timalo_portrait.jpg"
              style={{
                aspectRatio: '120/120',
                objectFit: 'cover',
              }}
              width={120}
            />
            <div className="space-y-2 text-center">
              <h3 className="text-lg font-semibold">TiMalo</h3>
              <p className="text-gray-500 dark:text-gray-400">
                Romancier &amp; activiste créolophone
              </p>
              <p className="text-sm">
                Thierry Malo alias TiMalo, est romancier et poète créolophone. Il est le
                premier romancier à avoir publié une série en créole, intitulé
                &rdquo;Dyablès&ldquo;. Il est également l’auteur de Dé Moun un recueil de
                19 textes poétiques, consacré aux évènements de 2009 et à la mobilisation
                du LKP.
              </p>
            </div>
          </div>
        </div>
      </section>
      <footer className="flex w-full shrink-0 flex-col items-center gap-2 border-t px-4 py-6 sm:flex-row md:px-6">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          © 2024 Acme SaaS. All rights reserved.
        </p>
        <nav className="flex gap-4 sm:ml-auto sm:gap-6">
          <Link className="text-xs underline-offset-4 hover:underline" href="#">
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
    </main>
  )
}
