import {Router} from 'express'
import { signUp,signIn } from '../controllers/auth.controller.js'
import { validateSignupMiddleware, validateLoginMiddleware } from '../validator/authValidator.js'

const authRouter = Router()

authRouter.post('/register', validateSignupMiddleware, signUp)

authRouter.post('/login', validateLoginMiddleware, signIn)

export default authRouter