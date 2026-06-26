import User from '../model/user.model.js'

export const getUsers = async(req,res,next)=>{
    try {
        const users = await User.find().select('-password')
        res.status(200).json({ success: true, data: users })
    } catch (error) {
        next(error)
    }
}

export const getUser = async(req,res,next)=>{
    try {
        const user = await User.findById(req.params.id).select('-password')
        if(!user) return res.status(404).json({ success: false, message: 'User not found' })
        res.status(200).json({ success: true, data: user })
    } catch (error) {
        next(error)
    }
}

export const updateTargets = async(req,res,next)=>{
    try {
        if(req.user._id.toString() !== req.params.id){
            return res.status(403).json({ success: false, message: 'Forbidden' })
        }
        const { calories, protein, carbs, fat } = req.body
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { calories, protein, carbs, fat },
            { new: true }
        ).select('-password')
        if(!user) return res.status(404).json({ success: false, message: 'User not found' })
        res.status(200).json({ success: true, data: user })
    } catch (error) {
        next(error)
    }
}
