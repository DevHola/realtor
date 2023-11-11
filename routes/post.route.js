const express = require('express')
const Router = express.Router()
const postController = require('../controller/post.controller')
const jwt = require('../middleware/jwt')
Router.post('/post', jwt.verify, postController.createPost)
Router.get('/post', jwt.verify, postController.getAllPostByUser)
module.exports = Router
