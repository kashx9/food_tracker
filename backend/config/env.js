import {config} from 'dotenv'

config({path:'backend/.env'})

export const{
    PORT,
    NODE_ENV,
    DB_URI,
    JWT_SECRET,
    JWT_EXPIRES_IN
} = process.env