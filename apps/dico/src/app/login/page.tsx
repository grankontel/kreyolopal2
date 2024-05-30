import { LoginForm } from '@/components/forms/login-form'
import Image from 'next/image'

export default function LoginPage() {
  return (
    <div className="flex size-full h-screen flex-row">
      <div className="hidden md:block bg-logo basis-1/2">
        <div className="m-4 px-4 py-12">
          <Image
            src="/images/logo_name-transparent.svg"
            priority
            width={218}
            height={60}
            alt="Zakari Brand"
          />
          <p className="scroll-m-20 pl-4 text-3xl font-medium tracking-tight text-gray-300 dark:text-gray-400">
            Utiliser les technologies d&apos;aujourd&apos;hui pour encourager, améliorer
            et diffuser l&apos;écriture du créole.
          </p>
        </div>
      </div>
      <div className="m-auto basis-1/2">
        <LoginForm />
      </div>
    </div>
  )
}
