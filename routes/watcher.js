'use strict'

const chokidar = require('chokidar')
const uploader = require('./amazon')

let watcher = chokidar.watch(appRoot + '/public/artists_images/', {})

watcher
  .on('add', function (path) {
    let fileArr = path.split('/')
    let file = fileArr[fileArr.length - 1]
    uploader(file)
    console.log('File', file, 'has been added')
  })