const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
// eslint-disable-next-line no-unused-vars
const dotenv = require('dotenv').config()

const app = express()
app.use(cors())
app.use(morgan('combined'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
const { db } = require('./model/index')
const Userrouter = require('./routes/user.route')
const Profilerouter = require('./routes/profile.route')
const Postrouter = require('./routes/post.route')
app.use((error, req, res, next) => {
  res.status(500).json({
    message: error.message
  })
})
app.use('/api', Userrouter)
app.use('/api', Profilerouter)
app.use('/api', Postrouter)

db.sequelize.sync({ force: true })
  .then(result => {
    console.log('Database Connected')
    app.listen(process.env.PORT, () => {
      console.log(`Server Running on Port ${process.env.PORT}`)
    })
  }).catch(error => {
    console.log(error)
  })
