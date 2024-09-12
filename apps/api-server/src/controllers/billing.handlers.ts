import type { Context } from "hono"
import config from '#config'
import Stripe from 'stripe'

const stripe = new Stripe(config.stripe.secretKey)

const getPlans = async function (c: Context) {
	const logger = c.get('logger')
	return stripe.plans.list({
		active: true,
		expand: ['data.product']

	}).then((result)=> {
		logger.info('getPlans result', result)
		c.status(200)
		return c.json(result.data)
	})
	.catch((_error) => {
		logger.error('plans Exception', _error)
		return c.json({ status: 'error', error: [_error] }, 500)
	})

}

export default { getPlans }