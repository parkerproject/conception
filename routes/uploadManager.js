require('dotenv').load()
var cloudinary = require('cloudinary')

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})
module.exports = function (router, db) {
  router.get('/conception/event/images', function (req, res) {})
  router.post('/conception/event/images', function (req, res) {
    if (req.url === '/conception/event/images' && req.method.toLowerCase() === 'post') {
      var path = ''
      var fileName = ''
      if (req.files.hasOwnProperty('file') && req.files.file.hasOwnProperty('path')) {
        path = req.files.file.path
      }
      if (req.files.hasOwnProperty('file') && req.files.file.hasOwnProperty('name')) {
        fileName = req.files.file.name
      }

      // stores a copy of image details in mongodb
      db.events.update({
        'id': req.body.event_id
      }, {
        $set: {
          'image_url': path,
          'image_name': fileName
        }
      }, {
        writeConcern: {
          w: 'majority',
          wtimeout: 5000
        }
      }, function (err, result) {
        if (!err) {
          console.log(result)
        }
      })
      // uploads image to the cloud
      if (path.length !== 0) {
        cloudinary.uploader.upload(req.files.file.path, function (result) {
          console.log(result)
        }, {
          public_id: req.body.event_id
        })
      }
      res.render('admin/event', {
        title: 'Conception'
      // data: req.body.event_id
      })
    }
  })
  return router
}
