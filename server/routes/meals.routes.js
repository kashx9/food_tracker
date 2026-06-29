import {Router} from 'express'
import { addMeal, deleteMealItem, getMealById, getMealHistory } from '../controllers/meal.controller.js'
import authorize from '../middleware/auth.middleware.js'
import { validateAddMealMiddleware, validateDeleteMealMiddleware, validateGetMealMiddleware } from '../validator/mealValidator.js'

const mealRouter = Router()

mealRouter.get('/history', authorize, getMealHistory)// Must be before /:date
mealRouter.get('/:date', authorize, validateGetMealMiddleware, getMealById)// Get meal by ID

mealRouter.post('/', authorize, validateAddMealMiddleware, addMeal)// Create new meal

mealRouter.delete('/:mealId/:mealType/:itemId', authorize, validateDeleteMealMiddleware, deleteMealItem)// Delete meal by ID

export default mealRouter