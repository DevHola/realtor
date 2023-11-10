const express = require('express')
const Router = express.Router()
const profileController = require('../controller/profile.controller')
const jwt = require('../middleware/jwt')
Router.post('/profile', jwt.verify, profileController.createProfile)
Router.patch('/profile', jwt.verify, profileController.updateProfile)
Router.get('/profile', jwt.verify, profileController.getprofilebyuserID)
module.exports = Router
