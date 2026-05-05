import MealTracker from "../model/mealTracker.model.js"

export const getMealById = async(req,res,next) => {
    try {
        const {date} = req.params
        const meal = await MealTracker.findOne({userId: req.user._id, date})
        if(!meal) {
            return res.status(404).json({
                success: false,
                message: 'Meal not found for the given user and date'
            })
        }
        res.status(200).json({
            success: true,
            data: meal
        })
    } catch (error) {
        next(error)
    }
}

export const addMeal = async(req,res,next) => {
    try {
        const { date, mealType, item } = req.body
        
        const VALID_MEALS = ['Breakfast','Lunch','Dinner','Snacks','Shakes']
        if (!VALID_MEALS.includes(mealType)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid meal type'
            })
        }

        const meal = await MealTracker.findOneAndUpdate(
            { userId: req.user._id, date },
            { 
                $push: { [`meals.${mealType}`]: item },
                $setOnInsert: { userId: req.user._id, date }
            },
            { upsert: true, new: true }
        )
        
        res.status(201).json({
            success: true,
            data: meal
        })
    } catch (error) {
        next(error)
    }
}

export const deleteMealItem = async (req, res, next) => {
  try {
    const { mealId, mealType, itemId } = req.params

    const VALID_MEALS = ['Breakfast','Lunch','Dinner','Snacks','Shakes']
    if (!VALID_MEALS.includes(mealType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid meal type'
      })
    }

    const meal = await MealTracker.findByIdAndUpdate(
      mealId,
      { $pull: { [`meals.${mealType}`]: { _id: itemId } } },
      { new: true }
    )

    if (!meal) {
      return res.status(404).json({
        success: false,
        message: 'Meal record not found'
      })
    }

    res.status(200).json({
      success: true,
      data: meal
    })
  } catch (error) {
    next(error)
  }
}
