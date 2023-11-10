const jwt = require('jsonwebtoken')
const verify = (req, res, next) => {
  const token = req.body.token || req.headers.authorization || req.headers['x-auth-token']
  if (!token) {
    res.status(401).json({
      message: 'Missing Authorization Headers'
    })
  }
  try {
    const decoded = jwt.verify(token, process.env.SecretKey)
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({
      message: 'Invalid Token'
    })
  }
}
module.exports = { verify }
