import MealTracker from "../model/mealTracker.model.js"

export const getMealHistory = async(req, res, next) => {
    try {
        const todayStr = req.query.today;
        const [year, month, day] = todayStr
            ? todayStr.split('-').map(Number)
            : [new Date().getUTCFullYear(), new Date().getUTCMonth()+1, new Date().getUTCDate()];
        const dates = Array.from({ length: 7 }, (_, i) => {
            const d = new Date(Date.UTC(year, month - 1, day - i));
            return d.toISOString().split('T')[0];
        });
        const meals = await MealTracker.find({
            userId: req.user._id,
            date: { $in: dates }
        }).sort({ date: -1 });
        res.status(200).json({ success: true, data: meals });
    } catch (error) {
        next(error);
    }
}

export const getMealById = async(req,res,next) => {
    try {
        const {date} = req.params
        const meal = await MealTracker.findOne({userId: req.user._id, date})
        res.status(200).json({
            success: true,
            data: meal || { meals: { Breakfast: [], Lunch: [], Dinner: [], Snacks: [], Shakes: [] } }
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
