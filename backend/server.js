import express from 'express'
import {PORT} from './config/env.js'
import connectToDb from './database/mongoDb.js'

const app = express()

app.listen(PORT, async () => {
    console.log(`Server is running on port ${PORT}`)
    await connectToDb()
})

export default app