import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Plan } from '@kreyolopal/domain'

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
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
			<path d="M20 6 9 17l-5-5" />
		</svg>
	)
}
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

const plans: Plan[] = [
  {
    "id": "price_1Py7kZJ0139cLC4FcLjlAT0Q",
    "object": "plan",
    "active": true,
    "aggregate_usage": null,
    "amount": 0,
    "amount_decimal": "0",
    "billing_scheme": "per_unit",
    "created": 1726127255,
    "currency": "eur",
    "interval": "month",
    "interval_count": 1,
    "livemode": false,
    "metadata": {},
    "meter": null,
    "nickname": null,
    "product": {
      "id": "prod_QpnLhre0HroDuF",
      "object": "product",
      "active": true,
      "attributes": [],
      "created": 1726127255,
      "default_price": "price_1Py7kZJ0139cLC4FcLjlAT0Q",
      "description": "La nouvelle édition du dictionnaire Créole-Français revue et corrigée par Hector Poullet.",
      "images": [],
      "livemode": false,
      "marketing_features": [
        {
          "name": "Définitions"
        },
        {
          "name": "Synonymes"
        },
        {
          "name": "Phrases d'usage"
        }
      ],
      "metadata": {
        "order": "1"
      },
      "name": "Standard",
      "package_dimensions": null,
      "shippable": null,
      "statement_descriptor": null,
      "tax_code": null,
      "type": "service",
      "unit_label": null,
      "updated": 1726141101,
      "url": null
    },
    "tiers_mode": null,
    "transform_usage": null,
    "trial_period_days": null,
    "usage_type": "licensed"
  }
]
const HomeHeader = () => (
	<header className="flex h-14 items-center px-4 lg:px-6 sm:bg-logo sm:text-logo-foreground fixed top-0 z-10 w-full">
		<Link className="flex items-center justify-center" href="/">
			<Logo className="h-6 w-6 flex sm:hidden" />
			<img
				src="/images/logo_name-transparent.svg"
				width={182}
				height={50}
				alt="Zakari Brand"
				className='hidden sm:flex'
			/>

			<span className="sr-only">Kreyolopal</span>
		</Link>
	</header>
)

const PlanTableTitle = () => (<div className="flex flex-col items-center justify-center space-y-4 text-center">
	<div className="space-y-2">
		<h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Pricing</h2>
		<p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
			Choose the plan that's right for your business.
		</p>
	</div>
</div>
)

const ProductFeatures = ({ features }: { features: Array<{name: string}> }) => {
	if (features.length === 0) {
		return null
	}

	return (
		<ul className="grid gap-2 text-sm text-gray-500 dark:text-gray-400">
			{features.map((feature, index) => (
				<li  key={index} className="flex items-center gap-2">
					<CheckIcon className="h-4 w-4 fill-primary" />
					{feature.name}
				</li>
			))}
		</ul>
	)
}

const PlanButton = ({plan_id, children}: {plan_id: string, children?: React.ReactNode}) => {
  return (
    <Link
      className="inline-flex h-10 items-center justify-center rounded-md bg-logo px-8 text-sm font-medium text-gray-50 shadow transition-colors hover:bg-gray-900/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950 disabled:pointer-events-none disabled:opacity-50 dark:bg-gray-50 dark:text-gray-900 dark:hover:bg-gray-50/90 dark:focus-visible:ring-gray-300"
      href={`/billing/register/${plan_id}`}
    >
      {children ?? 'Get started'}
    </Link>
  )
}

const PlanTableItem = ({ plan }: { plan: Plan }) => (
	<div className="grid gap-6 rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
		<div className="grid gap-2">
			<h3 className="text-2xl font-bold">{plan.product.name}</h3>
			<p className="text-gray-500 dark:text-gray-400">{plan.product.description}</p>
		</div>
		<div className="grid gap-4 items-center">
			<div className="flex items-baseline gap-1">
				{plan.amount > 0 ? (<h4 className="text-4xl font-bold">{plan.amount} &euro;</h4>) : (
					<h4 className="text-4xl font-bold">Gratuit</h4>
				)}
				
				{plan.amount > 0 ? (<span className="text-2xl font-normal text-gray-500 dark:text-gray-400">/{plan.interval}</span>) : ''}
			</div>

			<ProductFeatures features={plan.product.marketing_features} />
			<PlanButton plan_id={plan.id}>
				Choisir
			</PlanButton>
		</div>
	</div>
)
export default function Home() {
	return (
		<main className="flex min-h-[100dvh] flex-col">
			<HomeHeader />
			<section className='w-full py-6 md:py-12 lg:py-24 xl:py-32'>
				<div className="container max-w-6xl px-4 md:px-6">
					<PlanTableTitle />
					<div className="mx-auto grid gap-8 py-12 md:grid-cols-3 md:gap-6 lg:gap-8">
						{plans.map((plan) => (
							<PlanTableItem  key={plan.id} plan={plan} />
						))}
						<div className="grid gap-6 rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
							<div className="grid gap-2">
								<h3 className="text-2xl font-bold">Pro</h3>
								<p className="text-gray-500 dark:text-gray-400">Ideal for growing teams and businesses.</p>
							</div>
							<div className="grid gap-4 items-center">
								<div className="flex items-baseline gap-1">
									<h4 className="text-4xl font-bold">$49</h4>
									<span className="text-2xl font-normal text-gray-500 dark:text-gray-400">/mo</span>
								</div>
								<ul className="grid gap-2 text-sm text-gray-500 dark:text-gray-400">
									<li className="flex items-center gap-2">
										<CheckIcon className="h-4 w-4 fill-primary" />
										Up to 25 users
									</li>
									<li className="flex items-center gap-2">
										<CheckIcon className="h-4 w-4 fill-primary" />
										50GB storage
									</li>
									<li className="flex items-center gap-2">
										<CheckIcon className="h-4 w-4 fill-primary" />
										Advanced analytics
									</li>
									<li className="flex items-center gap-2">
										<CheckIcon className="h-4 w-4 fill-primary" />
										Custom branding
									</li>
								</ul>
								<Button size="lg">Get started</Button>
							</div>
						</div>
						<div className="grid gap-6 rounded-lg border bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-950">
							<div className="grid gap-2">
								<h3 className="text-2xl font-bold">Enterprise</h3>
								<p className="text-gray-500 dark:text-gray-400">Tailored for large teams and organizations.</p>
							</div>
							<div className="grid gap-4 items-center">
								<div className="flex items-baseline gap-1">
									<h4 className="text-4xl font-bold">$499</h4>
									<span className="text-2xl font-normal text-gray-500 dark:text-gray-400">/mo</span>
								</div>
								<ul className="grid gap-2 text-sm text-gray-500 dark:text-gray-400">
									<li className="flex items-center gap-2">
										<CheckIcon className="h-4 w-4 fill-primary" />
										Unlimited users
									</li>
									<li className="flex items-center gap-2">
										<CheckIcon className="h-4 w-4 fill-primary" />
										Unlimited storage
									</li>
									<li className="flex items-center gap-2">
										<CheckIcon className="h-4 w-4 fill-primary" />
										Enterprise-grade analytics
									</li>
									<li className="flex items-center gap-2">
										<CheckIcon className="h-4 w-4 fill-primary" />
										Dedicated account manager
									</li>
									<li className="flex items-center gap-2">
										<CheckIcon className="h-4 w-4 fill-primary" />
										Custom SLAs and support
									</li>
								</ul>
								<Button size="lg">Get started</Button>
							</div>
						</div>
					</div>
				</div>
			</section>
		</main>
	)
}