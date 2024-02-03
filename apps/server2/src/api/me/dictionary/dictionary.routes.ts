import { createRouter } from "#services/hono";
import handlers from './dictionary.handlers'

const myDicoRoutes = createRouter()

// get specific word
myDicoRoutes.get('/:word', handlers.getWord)

myDicoRoutes.put('/:word', handlers.bookmarkWord)

export default myDicoRoutes
