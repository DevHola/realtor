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
    const user = await User.findOne({
      where: {
        id: req.params.id
      }
    })
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

const addFriend = async (req, res, next) => {
  const user = await User.findByPk(req.user.id)
  const targetuser = await User.findByPk(req.params.id)
  const alreadyfriends = user.friends ? user.friends.some(friend => friend.id === targetuser.id) : false
  const talreadyfriends = targetuser.friends ? targetuser.friends.some(friend => friend.id === user.id) : false
  // TODO:WHEN USER ADD THE USERID AND STATUS WOULD BE ADDED TO FRIENDS ARRAY IT WOULD ALSO BE ADDED TO THE TARGET FRIEND LIST THEN IF TARGET USER ACCEPT THE BOTH USERS FRIEN STATUS IS ACCEPTED
  try {
    if (user.friends === null) {
      const fjempty = [{ id: targetuser.id, status: 'pending', isInitiator: true }]
      user.set(
        'friends', fjempty)
      await user.save()
    } else {
      if (alreadyfriends) {
        res.status(200).json({ message: 'already added' })
      } else {
        const friendofuser = [...user.friends, { id: targetuser.id, status: 'pending', isInitiator: true }]
        const friendjson = friendofuser
        user.set(
          'friends', friendjson
        )
        await user.save()
      }
    }
    if (targetuser.friends === null) {
      const tarempty = [{ id: user.id, status: 'pending', isInitiator: false }]
      targetuser.set(
        'friends', tarempty
      )
      await targetuser.save()
    } else {
      if (talreadyfriends) {
        res.status(200).json({ message: 'already added' })
      }
      const friendoftarget = [...targetuser.friends, { id: user.id, status: 'pending', isInitiator: false }]
      const tf = friendoftarget
      targetuser.set(
        'friends', tf
      )
      await targetuser.save()
    }
    res.status(200).json({
      message: 'friend request sent'
    })
  } catch (error) {
    next(error)
  }
}
const getrecievedallfriendRequest = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id)
    const friends = user.friends.filter(friend => friend.isInitiator === false && friend.status === 'pending')
    if (friends.length === 0) {
      res.status(200).json({
        message: 'no pending friend request'
      })
    }
    res.status(200).json({
      message: 'retrival Success',
      friends
    })
  } catch (error) {
    next(error)
  }
}
const getallsentfriendRequest = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id)
    const friends = user.friends.filter(friend => friend.isInitiator === true && friend.status === 'pending')
    if (friends.length === 0) {
      res.status(200).json({
        message: 'no pending friend request'
      })
    }
    res.status(200).json({
      message: 'retrival Success',
      friends
    })
  } catch (error) {
    next(error)
  }
}
const getUserFriends = async (req, res, next) => {
  try {
    const user = await User.findOne({ where: { id: req.user.id } })
    if (!user) {
      res.status(404).json({
        message: 'user not found'
      })
    }
    const friends = user.friends.filter(friend => friend.status === 'accepted')
    if (friends.length === 0) {
      res.status(200).json({
        message: '0 friends found'
      })
    }
    res.status(200).json({
      message: 'successful retrival',
      friends
    })
  } catch (error) {
    next(error)
  }
}
const cancelRequest = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id)
    const target = await User.findByPk(req.params.id)
    if (!user || !target) {
      res.status(404).json({
        message: 'user not found'
      })
    }
    const checkiffrienduser = user.friends.find(friend => friend.id === target.id)
    const checkiffriendtarget = target.friends.find(friend => friend.id !== user.id)
    if (!checkiffrienduser && !checkiffriendtarget) {
      res.status(200).json({
        message: 'both users are not friends'
      })
    }
    const userupdatefriends = user.friends.filter(friend => friend.id !== target.id)
    const targetupdatefriends = target.friends.filter(friend => friend.id !== user.id)
    user.set(
      'friends', userupdatefriends
    )
    target.set(
      'friends', targetupdatefriends
    )
    await Promise.all([user.save(), target.save()])
    res.status(200).json({
      message: 'user unfriend'
    })
  } catch (error) {
    next(error)
  }
}
const acceptRequest = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id)
    const target = await User.findByPk(req.params.id)
    if (!user || !target) {
      res.status(404).json({
        message: 'user not found'
      })
    }
    const userfriendup = user.friends.find(friend => {
      return friend.id === target.id && friend.status === 'pending' && friend.isInitiator === false
    })
    if (userfriendup) {
      userfriendup.status = 'accepted'
    }
    const remove = user.friends.filter(friend => friend.id !== userfriendup.id)
    remove.push(userfriendup)
    user.set(
      'friends', remove
    )
    console.log(remove)
    console.log(user.friends)
    await user.save()
    //
    const targetfriendup = target.friends.find(friend => {
      return friend.id === user.id && friend.status === 'pending' && friend.isInitiator === true
    })
    if (targetfriendup) {
      targetfriendup.status = 'accepted'
    }
    const tremove = target.friends.filter(friend => friend.id !== targetfriendup.id)
    tremove.push(targetfriendup)
    target.set(
      'friends', tremove
    )
    await target.save()
    res.status(200).json({
      message: 'friend request accepted',
      user,
      target
    })
  } catch (error) {
    next(error)
  }
}
module.exports = { registerUser, allUsers, user, deleteuser, updateuser, getuserUsername, userLogin, UserProfile, checkUserExistForget, userPosts, addFriend, getrecievedallfriendRequest, getallsentfriendRequest, getUserFriends, cancelRequest, acceptRequest }
