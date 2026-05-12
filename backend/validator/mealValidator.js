import Joi from "joi"

const validator = (schema) =>(payload) => schema.validate(payload, { abortEarly: false })

const addMealSchema = Joi.object({
    date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required(),
    mealType: Joi.string().valid('Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Shakes').required(),
    item: Joi.object({
        foodId: Joi.string().required(),
        name: Joi.string().required(),
        qty: Joi.number().positive().required(),
        unit: Joi.string().required(),
        cal: Joi.number().min(0).required(),
        protein: Joi.number().min(0).required(),
        carbs: Joi.number().min(0).required(),
        fat: Joi.number().min(0).required()
    }).required()
})

const deleteMealSchema = Joi.object({
    mealId: Joi.string().hex().length(24).required(),
    mealType: Joi.string().valid('Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Shakes').required(),
    itemId: Joi.string().hex().length(24).required()
})

const getMealSchema = Joi.object({
    date: Joi.string().pattern(/^\d{4}-\d{2}-\d{2}$/).required()
})

// Middleware functions
export const validateAddMealMiddleware = (req, res, next) => {
    const { error } = addMealSchema.validate(req.body, { abortEarly: false });
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });
    next();
}

export const validateDeleteMealMiddleware = (req, res, next) => {
    const { error } = deleteMealSchema.validate(req.params, { abortEarly: false });
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });
    next();
}

export const validateGetMealMiddleware = (req, res, next) => {
    const { error } = getMealSchema.validate(req.params, { abortEarly: false });
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });
    next();
}