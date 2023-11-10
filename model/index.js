const { Sequelize } = require('sequelize')

const sequelize = new Sequelize(
  process.env.PG_DB,
  process.env.PG_USER,
  process.env.PG_PASSWORD,
  {
    host: process.env.PG_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres'
  }
)
const db = {}
db.sequelize = sequelize

// Import Models
const User = require('./user.model')(sequelize)
const Profile = require('./profile.model')(sequelize)
// Association
User.hasOne(Profile, { foreignKey: 'userId', as: 'userProfile' })
Profile.belongsTo(User, { foreignKey: 'userId', as: 'user' })
module.exports = { db, User, Profile }
