const { Model, DataTypes } = require('sequelize')
module.exports = (sequelize) => {
  class Post extends Model {}
  Post.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true

    },
    content: {
      type: DataTypes.STRING,
      defaultValue: null,
      validate: {
        max: 400
      }
    },
    multimedia: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: null
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING)
    }
  },
  {
    sequelize,
    modelName: 'Post'
  })
  return Post
}
