const { DataTypes, Model } = require('sequelize')
module.exports = (sequelize) => {
  class Hashtag extends Model {}
  Hashtag.init({
    hashtage_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    hashtage_name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    }
  }, {
    sequelize,
    modelName: 'Hashtag'
  })
  return Hashtag
}
