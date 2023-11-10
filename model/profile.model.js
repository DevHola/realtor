const { DataTypes, Model } = require('sequelize')
module.exports = (sequelize) => {
  class Profile extends Model {}
  Profile.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    bio: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null
    }
  }, {
    sequelize,
    modelName: 'Profile'

  })
  Profile.belongsTo(sequelize.models.User, { foreignKey: 'userId' })
  return Profile
}
