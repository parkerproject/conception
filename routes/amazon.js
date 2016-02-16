'use strict'
require('dotenv').load()
const fs = require('fs')
const s3 = require('s3')
const AWS = require('aws-sdk')
const zlib = require('zlib')

AWS.config.region = 'us-west-2'

var uploadToAmazon = function (file, file_name, body) {
  let s3obj = new AWS.S3({
    params: {
      Bucket: 'artistworks',
      Key: 'artists_images/' + file_name,
      Prefix: 'artists_images',
      ACL: 'public-read'
    }
  })

  s3obj.upload({
    Body: body
  }).on('httpUploadProgress', function (evt) {
    console.log('file upload in progress')
  }).send(function (err, data) {
    console.log(err, data)
    fs.unlinkSync(file)
  })

}

module.exports = (photo) => {
  if (photo === '') {
    return
  }

  let imagePath = appRoot + '/public/artists_images/' + photo
  let body = fs.createReadStream(imagePath)
  uploadToAmazon(imagePath, photo, body)
    // var imagePath = appRoot + '/public/artists_images/' + photo
    // var uploader
    //
    // var file = fs.createReadStream(imagePath)
    //
    // file.on('close', function () {
    //   uploader = uploadToAmazon(imagePath, photo)
    //
    //   uploader.on('error', function (err) {
    //     console.error('unable to upload:', err.stack)
    //   })
    //   uploader.on('progress', function () {
    //     console.log('progress', uploader.progressMd5Amount,
    //       uploader.progressAmount, uploader.progressTotal)
    //   })
    //   uploader.on('end', function () {
    //     fs.unlinkSync(imagePath)
    //   })
    // })

}