import mongoose from 'mongoose'

const mealTrackerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: String,
    userName: String,
    targetCal: Number,
    targetProtein: Number,
    targetCarbs: Number,
    targetFat: Number,
    meals:{
        Breakfast:[{
            foodId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Food',
                required: true
            },
            name: String,
            qty: Number,
            unit: String,
            cal: Number,
            protein: Number,
            carbs: Number,
            fat: Number
        }],
        Lunch:[{
             foodId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Food',
                required: true
            },
            name: String,
            qty: Number,
            unit: String,
            cal: Number,
            protein: Number,
            carbs: Number,
            fat: Number
        }],
        Dinner:[{
             foodId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Food',
                required: true
            },
            name: String,
            qty: Number,
            unit: String,
            cal: Number,
            protein: Number,
            carbs: Number,
            fat: Number
        }],
        Snacks:[{
             foodId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Food',
                required: true
            },
            name: String,
            qty: Number,
            unit: String,
            cal: Number,
            protein: Number,
            carbs: Number,
            fat: Number
        }],
        Shakes:[{
             foodId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Food',
                required: true
            },
            name: String,
            qty: Number,
            unit: String,
            cal: Number,
            protein: Number,
            carbs: Number,
            fat: Number
        }]
    }
}, { timestamps: true })

const MealTracker = mongoose.model('MealTracker', mealTrackerSchema)

export default MealTracker