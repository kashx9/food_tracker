import {Router} from 'express'
import { getUser, getUsers, updateTargets } from '../controllers/user.controller.js'
import authorize from '../middleware/auth.middleware.js'

const userRouter = Router()

userRouter.get('/',authorize, getUsers)
userRouter.get('/:id', authorize, getUser)
userRouter.put('/:id/targets', authorize, updateTargets)

export default userRouter