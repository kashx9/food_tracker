import express from 'express'
import rateLimit from 'express-rate-limit'
import cors from 'cors'
import helmet from 'helmet'

import {PORT} from './config/env.js'
import connectToDb from './database/mongoDb.js'
import authRouter from './routes/auth.routes.js'
import userRouter from './routes/user.routes.js'
import foodRouter from './routes/foods.routes.js'
import mealRouter from './routes/meals.routes.js'

const app = express()
const limiter = rateLimit(
  { 
    windowMs: 15 * 60 * 1000, 
    max: 5,
    message: { error: "You have exceeded the 5-request limit!" }, 
    standardHeaders: true, 
    legacyHeaders: false, 
  })

app.use(cors({origin: process.env.CLIENT_URL || "http://localhost:5173"}))
app.use(express.json())
app.use(helmet())

app.use('/api/v1/auth', limiter, authRouter)
app.use('/api/v1/users', userRouter)
app.use('/api/v1/foods', foodRouter)
app.use('/api/v1/meals', mealRouter)

const startServer = async () => {
  try {
    await connectToDb()
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  } catch (error) {
    console.error('Failed to start server', error)
    process.exit(1)
  }
}

startServer()

app.use((err, req, res, next) => {
  const status = err.statusCode || err.status || 500;
  res.status(status).json({ success: false, message: err.message || "Internal server error" });
})

export default app