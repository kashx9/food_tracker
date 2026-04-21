import {Router} from 'express'

const mealRouter = Router()

mealRouter.get('/:id', (req, res) => {})// Get meal by ID

mealRouter.post('/', (req, res) => {})// Create new meal

mealRouter.put('/:id', (req, res) => {})// Update meal by ID

mealRouter.delete('/:id', (req, res) => {})// Delete meal by ID

export default mealRouter