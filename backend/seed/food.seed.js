import dns from 'dns'
dns.setServers(['1.1.1.1', '8.8.8.8'])

import mongoose from 'mongoose'
import { DB_URI } from '../config/env.js'
import Food from '../model/food.model.js'
import foods from './data.seed.js'

async function seedFoods() {
    try {
        await mongoose.connect(DB_URI)
        console.log('✅ Connected to DB')

        // Foods data imported from data.seed.js

        // inside seedFoods.js, after JSON.parse

        const VALID_CATEGORIES = ['Protein', 'Carbs', 'Fat', 'Beverage', 'Vegetable', 'Fruit', 'Dairy', 'Other']
        const VALID_UNITS = ['g', 'ml', 'piece', 'scoop', 'tbsp', 'tsp']

        const errors = []
        foods.forEach((food, i) => {
            if (!food.name) errors.push(`#${i}: missing name`)
            if (!VALID_CATEGORIES.includes(food.category)) errors.push(`#${i} ${food.name}: invalid category "${food.category}"`)
            if (!VALID_UNITS.includes(food.unit)) errors.push(`#${i} ${food.name}: invalid unit "${food.unit}"`)
            if (food.calories < 0) errors.push(`#${i} ${food.name}: negative calories`)
        })

        if (errors.length > 0) {
            console.error('❌ Validation failed:')
            errors.forEach(e => console.error('  -', e))
            process.exit(1)   // stops before touching the DB
        }

        console.log('✅ Validation passed')

        await Food.deleteMany({})
        console.log('🗑️  Cleared existing foods')

        const inserted = await Food.insertMany(foods)
        console.log(`🌱 Seeded ${inserted.length} foods successfully`)

    } catch (error) {
        console.error('❌ Seed failed:', error.message)
    } finally {
        await mongoose.disconnect()
        console.log('🔌 Disconnected from DB')
        process.exit(0)
    }
}

seedFoods()