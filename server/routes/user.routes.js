import {Router} from 'express'
import { getUser, getUsers, updateTargets, getFavMeals, addFavMeal, deleteFavMeal } from '../controllers/user.controller.js'
import authorize from '../middleware/auth.middleware.js'

const userRouter = Router()

userRouter.get('/',authorize, getUsers)
userRouter.get('/:id/fav-meals', authorize, getFavMeals)
userRouter.post('/:id/fav-meals', authorize, addFavMeal)
userRouter.delete('/:id/fav-meals/:favMealId', authorize, deleteFavMeal)
userRouter.get('/:id', authorize, getUser)
userRouter.put('/:id/targets', authorize, updateTargets)

export default userRouter