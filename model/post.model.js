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
      type: DataTypes.JSONB,
      allowNull: true,
      defaultValue: null
    },
    tags: {
      type: DataTypes.JSONB,
      allowNull: false,
      defaultValue: null
    }
  },
  {
    sequelize,
    modelName: 'Post'
  })
  return Post
}
