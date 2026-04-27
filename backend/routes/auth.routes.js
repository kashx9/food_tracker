import {Router} from 'express'
import { signUp,signIn } from '../controllers/auth.controller.js'

const authRouter = Router()

authRouter.post('/register', signUp)

authRouter.post('/login', signIn)

export default authRouter