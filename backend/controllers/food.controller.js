import Food from '../model/food.model.js'

export const getAllFoods = async (req, res, next) => {
    try {
        const foods = await Food.find()
        res.status(200).json({
            success: true,
            data: foods
        })
    } catch (error) {
        next(error)
    }
}

export const getFoodById = async (req, res, next) => {
    try {
        const food = await Food.findById(req.params.id)
        if (!food) {
            return res.status(404).json({
                success: false,
                message: 'Food not found'
            })
        }
        res.status(200).json({
            success: true,
            data: food
        })
    } catch (error) {
        next(error)
    }
}