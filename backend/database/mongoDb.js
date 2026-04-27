import mongoose from 'mongoose'
import { DB_URI,NODE_ENV } from '../config/env.js'
import dns from 'dns'

dns.setServers(["1.1.1.1","8.8.8.8"])

if(!DB_URI){
    throw new Error('Please define the MONGODB_URI environment variable')
    
}

const connectToDb = async()=> {
    try {
        await mongoose.connect(DB_URI)

        console.log(`Connected to database  in ${NODE_ENV} mode`)        
    } catch (error) {
        console.log("DB_URI:", DB_URI)
        console.error('Error connecting to databse',error)
    }
}

export default connectToDb