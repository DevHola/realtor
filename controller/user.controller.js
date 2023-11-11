const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { User, Profile, Post } = require('../model/index')

const registerUser = async (req, res, next) => {
  if (!req.body.name || !req.body.email || !req.body.password) {
    res.status(201).json({
      message: 'Enter all details.'
    })
  }
  const user = await User.findOne({
    where: {
      email: req.body.email
    }
  })
  if (user) {
    res.status(200).json({
      message: 'user exist'
    })
  }
  try {
    const hash = await bcrypt.hashSync(req.body.password, 10)
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: hash
    })
    const data = {
      id: user.id,
      name: user.name,
      email: user.email
    }
    const token = jwt.sign(data, process.env.SecretKey, { expiresIn: 60 * 60 })
    res.status(200).json({
      message: 'user created successfully!!',
      token
    })
  } catch (error) {
    next(error)
  }
}
const userLogin = async (req, res, next) => {
  if (!req.body.email) {
    res.status(422).json({
      message: 'email is empty'
    })
  }
  if (!req.body.password) {
    res.status(422).json({
      message: 'password is empty'
    })
  }
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email
      }
    })
    if (!user) {
      res.status(404).json({
        message: 'User not found'
      })
    }
    const compare = await bcrypt.compareSync(req.body.password, user.password)
    const data = {
      id: user.id,
      name: user.name,
      email: user.email
    }
    if (compare) {
      const tokenkey = jwt.sign(data, process.env.SecretKey, { expiresIn: 60 * 60 })
      res.status(200).json({
        token: tokenkey,
        message: 'Success'
      })
    } else {
      res.status(422).json({
        message: 'Password Incorrect'
      })
    }
  } catch (error) {
    next(error)
  }
}
const checkUserExistForget = async (req, res, next) => {
  if (!req.body.email) {
    res.status(422).json({
      message: 'email is empty'
    })
  }
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email
      }
    })
    if (user) {
      // Mail Reset Token
      res.status(200).json({
        message: 'Check Your Mail . a reset has been initiated'
      })
    } else {
      res.status(404).json({
        message: 'user not found'
      })
    }
  } catch (error) {
    next(error)
  }
}
const allUsers = async (req, res, next) => {
  try {
    const users = await User.findAll()
    res.status(200).json({
      users
    })
  } catch (error) {
    next(error)
  }
}
const user = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id)
    if (!user) {
      res.status(404).json({ message: 'User not found' })
    }
    res.status(200).json({
      user
    })
  } catch (error) {
    next(error)
  }
}
const deleteuser = async (req, res, next) => {
  const user = await User.findByPk(req.params.id)
  if (!user) {
    req.status(404).json({
      message: 'user not found'
    })
  }
  await user.destroy({
    where: {
      id: req.params.id
    }
  }).then(result => {
    res.status(200).json({
      message: 'user deleted'
    })
  }).catch(error => {
    next(error)
  })
}
const updateuser = async (req, res, next) => {
  const user = await User.findByPk(req.params.id)
  if (!user) {
    res.status(404).json({
      message: 'user not found'
    })
  }
  try {
    const data = {
      name: req.body.name || user.name,
      email: req.body.email || user.email
    }
    await User.update({ name: data.name, email: data.email })
    res.status(200).json({
      message: 'user updated'
    })
  } catch (error) {
    next(error)
  }
}
const getuserUsername = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: ['username', 'email'],
      where: {
        id: req.params.id
      }
    })
    res.status(200).json(
      users
    )
  } catch (error) {
    next(error)
  }
}
const UserProfile = async (req, res, next) => {
  try {
    const users = await User.findByPk(req.user.id, { include: { model: Profile, as: 'userProfile' } })
    if (!user) {
      res.status(404).json({
        message: 'user not found'
      })
    }
    res.status(200).json({
      message: 'succcess',
      user: users,
      id: req.user.id
    })
  } catch (error) {
    console.log(error.message)
    next(error)
  }
}
const userPosts = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: { model: Post, as: 'posts' }
    })
    if (!user) {
      res.status(404).json({
        meessage: 'user posts not found'
      })
    }
    res.status(200).json({
      message: 'success',
      user
    })
  } catch (error) {
    next(error)
  }
}
module.exports = { registerUser, allUsers, user, deleteuser, updateuser, getuserUsername, userLogin, UserProfile, checkUserExistForget, userPosts }
