import mongoose from 'mongoose'

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        minlength: 3,  // Fixed: was 'min: 3'
        maxlength: 100,
        trim: true
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        enum: ['Protein', 'Carbs', 'Fat', 'Beverage', 'Vegetable', 'Fruit', 'Dairy', 'Other']
    },
    unit: {
        type: String,
        required: [true, 'Unit is required'],
        enum: ['g', 'ml', 'piece', 'scoop', 'tbsp', 'tsp']  // Added 'piece', 'scoop'
    },
    gramsPerUnit: {
        type: Number,
        required: [true, 'Grams per unit is required'],
        min: 0.1  // Minimum 0.1g
    },
    // Nutritional info per 100g
    calories: {
        type: Number,
        required: [true, 'Calories is required'],
        min: 0
    },
    protein: {
        type: Number,
        required: [true, 'Protein is required'],
        min: 0
    },
    carbs: {
        type: Number,
        required: [true, 'Carbs is required'],
        min: 0
    },
    fat: {
        type: Number,
        required: [true, 'Fat is required'],
        min: 0
    }
}, { timestamps: true })

const Food = mongoose.model('Food', foodSchema)

export default Food