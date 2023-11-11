const { Post, User } = require('../model/index')
const createPost = async (req, res, next) => {
  if (req.body) {
    try {
      const post = await Post.create({
        content: req.body.content,
        multimedia: req.body.multimedia,
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
module.exports = { createPost, getAllPostByUser }
