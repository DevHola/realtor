const express = require('express')
const Router = express.Router()
const postController = require('../controller/post.controller')
const jwt = require('../middleware/jwt')
const upload = require('../middleware/multer')
Router.post('/post', upload.array('multimedia'), jwt.verify, postController.createPost)
Router.get('/post', jwt.verify, postController.getAllPostByUser)
Router.patch('/post/:id', jwt.verify, postController.updatePost)
module.exports = Router
