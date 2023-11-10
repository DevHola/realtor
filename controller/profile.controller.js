const { User, Profile } = require('../model/index')

const createProfile = async (req, res, next) => {
  if (!req.body.username) {
    res.status(422).json({
      message: 'username is empty'
    })
  }
  try {
    const user = await User.findByPk(req.user.id)
    const createprofile = await Profile.create({
      username: req.body.username,
      bio: req.body.bio,
      userId: user.id
    })
    res.status(200).json({
      message: 'profile successfully created',
      success: true,
      profile: createprofile
    })
  } catch (error) {
    next(error)
  }
}
const updateProfile = async (req, res, next) => {
  try {
    const user = await Profile.findOne({
      where: {
        userId: req.user.id
      }
    })
    if (!user) {
      res.status(404).json({
        message: 'user profile not found'
      })
    }
    await user.update({ bio: req.body.bio, username: req.body.username || user.username })
    res.status(200).json({
      message: 'profile updated'
    })
  } catch (error) {
    next(error)
  }
}
const getprofilebyuserID = async (req, res, next) => {
  try {
    const userProfile = await Profile.findOne({
      where: {
        userId: req.user.id
      }
    })
    if (!userProfile) {
      res.status(404).json({
        message: 'user not found'
      })
    }
    res.status(200).json({
      profile: userProfile,
      success: true
    })
  } catch (error) {
    next(error)
  }
}
module.exports = { createProfile, updateProfile, getprofilebyuserID }
