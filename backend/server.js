import express from 'express'
import {PORT} from './config/env.js'
import connectToDb from './database/mongoDb.js'
import authRouter from './routes/auth.routes.js'
import userRouter from './routes/user.routes.js'
import foodRouter from './routes/foods.routes.js'

const app = express()

app.use(express.json())

app.use('/api/v1/auth', authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/foods', foodRouter)

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`)
    await connectToDb()
})

export default app