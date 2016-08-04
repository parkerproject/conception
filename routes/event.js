require('dotenv').load()

var db = require('../config/database')
var _ = require('underscore')
var getEventOnEventbrite = require('../models/get_event')
var moment = require('moment')

function formatAMPM (date) {
  var hours = date.getHours()
  var minutes = date.getMinutes()
  var ampm = hours >= 12 ? 'pm' : 'am'
  hours = hours % 12
  hours = hours || 12 // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes
  var strTime = hours + ':' + minutes + ' ' + ampm
  return strTime
}

module.exports = function (router) {
  router.get('/event/:id', function (req, res) {
    var id = parseInt(req.params.id)
    db.artists.find({
      'events': id,
      approved: true
    }, function (err, artists) {
      if (err || !artists) {
        console.log(err)
      } else {
        var sortedArtists = _.sortBy(artists, function (artist) {
          return artist.full_name.toLowerCase()
        })

        getEventOnEventbrite(id, function (event) {
          var eventObject = JSON.parse(event)
          var liveEvent = eventObject.event
          var dateObj = new Date(liveEvent.start_date)
          var month = dateObj.getUTCMonth() + 1; // months from 1-12
          var day = dateObj.getUTCDate()

          var dateObj_endtime = new Date(liveEvent.end_date)

          var monthNames = []
          monthNames[1] = 'Jan'
          monthNames[2] = 'Feb'
          monthNames[3] = 'Mar'
          monthNames[4] = 'Apr'
          monthNames[5] = 'May'
          monthNames[6] = 'Jun'
          monthNames[7] = 'Jul'
          monthNames[8] = 'Aug'
          monthNames[9] = 'Sep'
          monthNames[10] = 'Oct'
          monthNames[11] = 'Nov'
          monthNames[12] = 'Dec'

          res.render('new/event', {
            title: 'conception events',
            data: JSON.stringify(event),
            artists: artists,
            sortedArtists: sortedArtists,
            event_id: id,
            liveEvent: liveEvent,
            month: monthNames[month],
            day: day,
            buyUrl: liveEvent.url.split('?')[0],
            start_time: formatAMPM(dateObj),
            end_time: formatAMPM(dateObj_endtime),
            logo: liveEvent.logo,
            start_time2: moment(liveEvent.start_date).format('MMMM Do YYYY')
          })
        })
      }
    })
  })

  return router
}
