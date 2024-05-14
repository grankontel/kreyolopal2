import ImageSet from '@/components/image-set'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

import { SVGProps } from 'react'
import HomeHeader from './_components/home-header'
import HomeFooter from './_components/home-footer'
import WaitingList from './_components/waiting-list'

const LearnMore = () => {
  return (
    <Link
      className="inline-flex h-10 items-center justify-center rounded-md border border-gray-200 border-gray-200 bg-white px-8 text-sm font-medium shadow-sm transition-colors hover:bg-gray-100 hover:text-gray-900 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:border-gray-800 dark:border-gray-800 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus-visible:ring-gray-300"
      href="#"
    >
      En savoir plus
    </Link>
  )
}
const StartFreeTrial = () => {
  return (
    <Link
      className="inline-flex h-10 items-center justify-center rounded-md bg-logo px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
      href="/#pricing"
    >
      Inscrivez-vous
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
      <HomeHeader />
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
              {/* <LearnMore /> */}
            </div>
          </div>
        </div>
      </HomeSection>

      <HomeSection className="py-6 md:py-12 lg:py-24 xl:py-32 bg-gray-100  dark:bg-gray-800">
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
                {/* <LearnMore /> */}
              </div>
            </div>
          </div>
        </div>
      </HomeSection>

      <HomeSection className="  w-full pb-4 pt-6 md:pt-12 lg:pt-24">
        <div className="flex flex-col items-center space-y-2 space-y-4 px-4 py-4 text-center md:px-6">
          <h2 id="team"
            className="text-3xl font-bold tracking-tighter sm:text-5xl">
            L&apos;équipe
          </h2>
          <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            Voici l'équipe fondatrice qui a uni ses forces pour créer cette plateforme. 
            Chacun apportant une perspective unique sur le créole et ses usages.
          </p>
        </div>
        <div className="container grid grid-cols-1 gap-8 px-4 md:grid-cols-3 md:px-6">
          <div className="flex flex-col items-center space-y-4 rounded-lg bg-gray-100 p-6 dark:bg-logo-800">
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
              <p className="text-gray-500 dark:text-gray-400">Auteur &ndash; Lexicographe</p>
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
              <p className="text-gray-500 dark:text-gray-400">Auteur &ndash; Compositeur</p>
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
                Romancier &ndash; Activiste
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
      </HomeSection>
      <HomeSection className=" w-full pb-4 pt-6 md:pt-12 lg:pt-24">
        <div className="flex flex-col items-center space-y-2 space-y-4 px-4 py-4 text-center md:px-6">

          <h2 id="pricing"
            className="text-3xl font-bold tracking-tighter sm:text-5xl">
            Inscrivez-vous gratuitement
          </h2>
          <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
            En attendant l'ouverture de la plateforme, nous vous invitons à nous inscrire sur notre liste d'attente.
          </p>

          <WaitingList list_id="16815" />
        </div>
      </HomeSection>
      <HomeFooter />
    </main>
  )
}
