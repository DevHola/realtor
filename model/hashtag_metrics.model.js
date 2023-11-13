const { DataTypes, Model } = require('sequelize')
module.exports = (sequelize) => {
  class Hashtagmetrics extends Model {}
  Hashtagmetrics.init({
    hm_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    usage_count: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      allowNull: false
    },
    last_usage: {
      type: DataTypes.TEXT,
      allowNull: false
    }

  }, {
    sequelize,
    modelName: 'Hashatagmetrics'
  })
  return Hashtagmetrics
}
