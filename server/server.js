import express from 'express'
import {PORT} from './config/env.js'
import connectToDb from './database/mongoDb.js'
import authRouter from './routes/auth.routes.js'
import userRouter from './routes/user.routes.js'
import foodRouter from './routes/foods.routes.js'
import mealRouter from './routes/meals.routes.js'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json())

app.use('/api/v1/auth', authRouter)
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