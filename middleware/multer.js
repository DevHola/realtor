const multer = require('multer')
const path = require('path')
const fs = require('fs')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()

    let mediaType = ''

    if (file.mimetype.startsWith('image/')) {
      mediaType = 'image'
    } else if (file.mimetype.startsWith('video/')) {
      mediaType = 'video'
    } else {
      const error = new Error('Invalid file type')
      error.status = 400
      return cb(error)
    }

    const uploadPath = `./upload/${year}/${month}/multimedia/${mediaType}`
    // Create the directories if they don't exist
    fs.mkdirSync(uploadPath, { recursive: true })
    cb(null, uploadPath)
  },
  filename: (req, file, cb) => {
    const uniqueFileName = file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    cb(null, uniqueFileName)
  }
})

const upload = multer({ storage })

module.exports = upload
