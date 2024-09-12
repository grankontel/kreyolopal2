import { redirect } from "next/navigation";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '');
export const runtime = 'edge'

export default async function Page({
  params,
}: {
  params: { plan_id: string }
}) {

	const session = await stripe.checkout.sessions.create({
    billing_address_collection: 'auto',
    line_items: [
      {
        price: params.plan_id,
        // For metered billing, do not pass quantity
        quantity: 1,

      },
    ],
    mode: 'subscription',
    success_url: `http://localhost:3000/payment/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `http://localhost:3000/payment/cancel`,
  });

	console.log(session)
	redirect(session.url);
}