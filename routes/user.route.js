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
Router.get('/forget', Usercontroller.checkUserExistForget)
Router.delete('/user/delete/:id', Usercontroller.deleteuser)

module.exports = Router
