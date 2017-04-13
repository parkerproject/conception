require('dotenv').load();

const db = require('../config/database');
const _ = require('underscore');
const getEventOnEventbrite = require('../models/get_event');
const moment = require('moment');

function formatAMPM(date) {
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';
  hours %= 12;
  hours = hours || 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? `0${minutes}` : minutes;
  const strTime = `${hours}:${minutes} ${ampm}`;
  return strTime;
}

module.exports = function (router) {
  router.get('/event/:id', (req, res) => {
    const id = parseInt(req.params.id);
    db.artists.find({
      events: id,
      approved: true,
    }, (err, artists) => {
      if (err || !artists) {
        console.log(err);
      } else {
        const sortedArtists = _.sortBy(artists, artist => artist.full_name.toLowerCase());

        getEventOnEventbrite(id, (event) => {
          const eventObject = JSON.parse(event);
          const liveEvent = eventObject.event;
          const dateObj = new Date(liveEvent.start_date);
          const month = dateObj.getUTCMonth() + 1; // months from 1-12
          const day = dateObj.getUTCDate();

          const dateObj_endtime = new Date(liveEvent.end_date);

          const monthNames = [];
          monthNames[1] = 'Jan';
          monthNames[2] = 'Feb';
          monthNames[3] = 'Mar';
          monthNames[4] = 'Apr';
          monthNames[5] = 'May';
          monthNames[6] = 'Jun';
          monthNames[7] = 'Jul';
          monthNames[8] = 'Aug';
          monthNames[9] = 'Sep';
          monthNames[10] = 'Oct';
          monthNames[11] = 'Nov';
          monthNames[12] = 'Dec';

          res.render('new/event', {
            title: 'conception events',
            data: JSON.stringify(event),
            artists,
            sortedArtists,
            event_id: id,
            liveEvent,
            month: monthNames[month],
            day,
            buyUrl: liveEvent.url.split('?')[0],
            start_time: formatAMPM(dateObj),
            end_time: formatAMPM(dateObj_endtime),
            logo: liveEvent.logo,
            start_time2: moment(liveEvent.start_date).format('MMMM Do YYYY'),
          });
        });
      }
    });
  });

  return router;
};
