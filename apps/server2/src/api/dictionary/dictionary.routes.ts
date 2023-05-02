import { createRouter } from '../../services/hono'
import dicoHandlers from './dictionary.handlers'

const dicoRoutes = createRouter()
// get suggestion
dicoRoutes.get('/suggest/:word', dicoHandlers.getSuggestion)

// get specific word
dicoRoutes.get('/:language/:word', dicoHandlers.getWord)

export default dicoRoutes
