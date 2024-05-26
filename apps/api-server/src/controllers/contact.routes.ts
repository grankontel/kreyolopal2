import { createRouter, sendBadRequest } from '#utils/hono'
import { zValidator } from '@hono/zod-validator'
import { contactSchema } from '@kreyolopal/domain'
import handlers from './contact.handlers'

const contactRoutes = createRouter()
// contact
contactRoutes.post(
	'/',
	zValidator('json', contactSchema, sendBadRequest),
	handlers.contact
)

export default contactRoutes
