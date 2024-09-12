import { createRouter, sendBadRequest } from '#utils/hono'
import { zValidator } from '@hono/zod-validator'
import { loginSchema, signupSchema } from '@kreyolopal/domain'
import handlers from './billing.handlers'

const billingRoutes = createRouter()

// list plans
billingRoutes.get(
  '/plans',
  handlers.getPlans
)

export default billingRoutes
