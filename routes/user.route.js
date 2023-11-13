const express = require('express')
const Router = express.Router()
const verifytoken = require('../middleware/jwt')
const Usercontroller = require('../controller/user.controller')
Router.post('/register', Usercontroller.registerUser)
Router.post('/login', Usercontroller.userLogin)
Router.get('/users', Usercontroller.allUsers)
Router.get('/user/:id', verifytoken.verify, Usercontroller.user)
Router.get('/profile/user', verifytoken.verify, Usercontroller.UserProfile)
Router.get('/posts', verifytoken.verify, Usercontroller.userPosts)
Router.post('/add/friend/:id', verifytoken.verify, Usercontroller.addFriend)
Router.get('/user/friend/manage/received/requests', verifytoken.verify, Usercontroller.getrecievedallfriendRequest)
Router.get('/user/friend/manage/sent/requests', verifytoken.verify, Usercontroller.getallsentfriendRequest)
Router.get('/friends', verifytoken.verify, Usercontroller.getUserFriends)
Router.post('/user/friend/manage/unfriend/:id', verifytoken.verify, Usercontroller.cancelRequest)
Router.post('/user/friend/manage/accept/:id', verifytoken.verify, Usercontroller.acceptRequest) // TODO:NOT WORKING
Router.get('/forget', Usercontroller.checkUserExistForget)
Router.delete('/user/delete/:id', Usercontroller.deleteuser)

module.exports = Router
