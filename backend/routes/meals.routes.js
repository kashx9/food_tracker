import {Router} from 'express'
import { addMeal, deleteMealItem, getMealById } from '../controllers/meal.controller.js'
import authorize from '../middleware/auth.middleware.js'

const mealRouter = Router()

mealRouter.get('/:date',authorize ,getMealById)// Get meal by ID

mealRouter.post('/',authorize ,addMeal)// Create new meal

mealRouter.delete('/:mealId/:mealType/:itemId', authorize, deleteMealItem)// Delete meal by ID

export default mealRouter