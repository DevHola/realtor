const { Post, User } = require('../model/index')
const createPost = async (req, res, next) => {
  if (req.body) {
    if (!req.files) {
      return res.status(400).json({ message: 'No PDF file uploaded' })
    }
    try {
      const filepaths = []
      req.files.forEach(file => {
        filepaths.push(file.path)
      })
      const post = await Post.create({
        content: req.body.content,
        multimedia: filepaths,
        tags: req.body.tags,
        userId: req.user.id
      })
      res.status(200).json({
        message: 'new post created',
        post
      })
    } catch (error) {
      next(error)
    }
  }
}
const getAllPostByUser = async (req, res, next) => {
  try {
    const post = await Post.findAll({
      where: {
        userId: req.user.id
      },
      order: [['createdAt', 'DESC']],
      include: {
        model: User, as: 'user'
      }
    })
    if (post) {
      res.status(200).json({
        message: 'success',
        post
      })
    }
  } catch (error) {
    next(error)
  }
}
const updatePost = async (req, res, next) => {
  const user = await User.findByPk(req.user.id)
  if (!user) {
    res.status(404).json({
      message: 'user not found'
    })
  }
  const post = await Post.findByPk(req.params.id)
  if (!post) {
    res.status(404).json({
      message: 'post not found'
    })
  }
  if (user.id === post.userId) {
    try {
      const data = {
        content: req.body.content || post.content,
        tag: req.body.tags || post.tags
      }
      await post.update({ content: data.content, tags: data.content })
      res.status(200).json({
        message: 'post updated'
      })
    } catch (error) {
      next(error)
    }
  }
}
const getAllFriendsPost = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id)
    if (!user) {
      res.status(404).josn({
        message: 'user not found'
      })
    }
    const allpost = []
    const friends = user.friends.filter(friend => friend.status === 'accepted')
    for (let i = 0; i < friends.length; i++) {
      const userpost = await Post.findAll({
        where: {
          userId: friends[i].id
        }
      })
      allpost.push(...userpost)
    }
    res.status(200).json({
      message: 'friends status retrieved',
      allpost
    })
  } catch (error) {
    next(error)
  }
}
module.exports = { createPost, getAllPostByUser, updatePost, getAllFriendsPost }
