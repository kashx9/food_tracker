import {Router} from 'express'

const foodRouter = Router()

foodRouter.get('/', (req, res) => {})// Get all foods

foodRouter.get('/:id', (req, res) => {})// Get food by ID

foodRouter.post('/', (req, res) => {})// Create new food

foodRouter.put('/:id', (req, res) => {})// Update food by ID

foodRouter.delete('/:id', (req, res) => {})// Delete food by ID

export default foodRouter