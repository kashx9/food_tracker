import {Router} from 'express'
import { getAllFoods, getFoodById } from '../controllers/food.controller.js'

const foodRouter = Router()

foodRouter.get('/', getAllFoods)// Get all foods

foodRouter.get('/:id', getFoodById)// Get food by ID

foodRouter.post('/', (req, res) => {})// Create new food

foodRouter.put('/:id', (req, res) => {})// Update food by ID

foodRouter.delete('/:id', (req, res) => {})// Delete food by ID

export default foodRouter