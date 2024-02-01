import { createRouter } from "#services/hono";
import handlers from './dictionary.handlers'

const myDicoRoutes = createRouter()

// get specific word
myDicoRoutes.get('/:language/:word', handlers.getWord)

export default myDicoRoutes
