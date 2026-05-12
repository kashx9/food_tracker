import Joi from "joi"

const validator = (schema) =>(payload) => schema.validate(payload, { abortEarly: false })

const signupSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
})

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
})


// Middleware functions
export const validateSignupMiddleware = (req, res, next) => {
    const { error } = signupSchema.validate(req.body, { abortEarly: false });
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });
    next();
}

export const validateLoginMiddleware = (req, res, next) => {
    const { error } = loginSchema.validate(req.body, { abortEarly: false });
    if (error) return res.status(400).json({ success: false, message: error.details[0].message });
    next();
}
