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
const Post = require('./post.model')(sequelize)
const Hashtag = require('./hashtag.model')(sequelize)
const Hashatagmetrics = require('./hashtag_metrics.model')(sequelize)
// Association
User.hasOne(Profile, { foreignKey: 'userId', as: 'userProfile' })
Profile.belongsTo(User, { foreignKey: 'userId', as: 'user' })
User.hasMany(Post, { foreignKey: 'userId', as: 'posts' })
Post.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user'
})
Post.hasMany(Hashtag, { through: 'PostHashtag', foreignKey: 'postId' })
Hashtag.belongsToMany(Post, { through: 'PostHashtag', foreignKey: 'hashtagId' })
Hashtag.hasOne(Hashatagmetrics, { foreignKey: 'hashtagId', as: 'metics' })
Hashatagmetrics.belongsTo(Hashtag, { foreignKey: 'hashtagId', as: 'hashtag' })
module.exports = { db, User, Profile, Post }
