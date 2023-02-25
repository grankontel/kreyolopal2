import express from 'express';
import dicoHandlers from './dictionary.handlers'
const dicoRoutes = express.Router()

// get suggestion
dicoRoutes.get('/suggest/:word', dicoHandlers.getSuggestion)

// get specific word
dicoRoutes.get('/:language/:word', dicoHandlers.getWord)

export default dicoRoutes
