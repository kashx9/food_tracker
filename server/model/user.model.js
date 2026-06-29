import mongoose from "mongoose"

const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,'Name is required'],
        min: 3,
        max: 50
    },
    email:{
        type: String,
        required: [true,'Email is required'],
        unique: true,
        lowercase: true,
        match: [/.+@.+\..+/, 'Please enter a valid email address']
    },
    password:{
        type: String,
        required: [true,'Password is required'],
        min: 6
    },
    calories:{
        type: Number,
        min: 0
    },
    protein: {
        type: Number,
        min: 0
    },
    carbs: {
        type: Number,
        min: 0
    },
    fat: {
        type: Number,
        min: 0
    },
    favMeals: [{
        name: { type: String, required: true },
        items: [{
            foodId: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
            name:    String,
            qty:     Number,
            unit:    String,
            cal:     Number,
            protein: Number,
            carbs:   Number,
            fat:     Number,
        }]
    }]
},{timestamps: true})

const User = mongoose.model('User', userSchema)

export default User