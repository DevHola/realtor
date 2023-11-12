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
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
      get () {
        const storedvalue = this.getDataValue('multimedia')
        return storedvalue ? storedvalue.split(';') : []
      },
      set (val) {
        this.setDataValue('multimedia', Array.isArray(val) ? val.join(';') : val)
      }
    },
    tags: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
      get () {
        const storedvalue = this.getDataValue('tags')
        return storedvalue ? storedvalue.split(';') : []
      },
      set (val) {
        this.setDataValue('tags', Array.isArray(val) ? val.join(';') : val)
      }
    }
  },
  {
    sequelize,
    modelName: 'Post'
  })
  return Post
}
