var CONCEPTION = (function() {
  'use strict';

  function rowTpl(model) {
    var colorLabel, html, ticketSold;
    if (model.hasOwnProperty('tickets')) {
      if (model.tickets[0].ticket.quantity_sold === 0) {
        colorLabel = 'bg-red';
      } else {
        colorLabel = 'bg-green';
      }
      ticketSold = model.tickets[0].ticket.quantity_sold;
    } else {
      colorLabel = 'bg-yellow';
      ticketSold = 'Create tickets';
    }

    // var colorLabel = (model.tickets[0].ticket.quantity_sold)
    html = ['<tr>',
      '<td>' + model.id + '</td>',
      '<td>' + model.title + '</td>',
      '<td>' + model.start_date + '</td>',
      '<td>' + model.end_date + '</td>',
      '<td>' + model.status + '</td>',
      '<td width="10%"><span class="badge ' + colorLabel + '">' + ticketSold + '</span></td>',
      '</tr>'
    ].join("");

    return html;
  }

  function template(row) {
    var html = ['<div class="box">',
      '<div class="box-body">',
      '<table class="table table-bordered table table-hover dataTable">',
      '<tbody><tr>',
      '<th style="width: 10px">Event ID</th>',
      '<th>Name</th>',
      '<th>Start date</th>',
      '<th>End date</th>',
      '<th>Status</th>',
      '<th>Tickets sold</th>',
      '</tr>' + row + '</tbody></table>',
      '</div>',
      '</div>'
    ].join("");
    return html;
  }

  function artistTplHeader(row) {
    var html = ['<div class="box">',
      '<div class="box-body">',
      '<table class="table table-bordered table table-hover dataTable">',
      '<tbody><tr>',
      '<th style="width: 10px">Name</th>',
      '<th>Email</th>',
      '<th>Date of Birth</th>',
      '<th>Artwork</th>',
      '<th>Url</th>',
      '<th>Approved</th>',
      '</tr>' + row + '</tbody></table>',
      '</div>',
      '</div>'
    ].join("");
    return html;
  }

  function artistTemplate(artist) {

    var colorLabel, html, ticketSold = 0;
    html = ['<tr>',
      '<td>' + artist.full_name + '</td>',
      '<td>' + artist.email + '</td>',
      '<td>' + artist.date_birth + '</td>',
      '<td>' + artist.artwork + '</td>',
      '<td>' + artist.url + '</td>',
      '<td width="10%"><span class="badge ' + colorLabel + '">' + ticketSold + '</span></td>',
      '</tr>'
    ].join("");

    return html;

  }


  function routes() {

    page('/conception/:name', function(ctx) {

      var name = ctx.params.name;
			
      if (name == 'events') {
        $.getJSON('/conception/' + name, function(data) {
          var events = data.events,
            html = [],
            rows;
          for (var i = 0; i < events.length; i++) {
            html.push(rowTpl(events[i].event));
          }

          rows = template(html.join(""));
          document.querySelector('.event_json').innerHTML = rows;
          document.querySelector('.content-header').querySelector('h1').innerHTML = 'Events';
        });
      }

      if (name == 'artists') {
        $.getJSON('/conception/' + name, function(data) {
					window.artists = data;
//           var events = data.events,
//             html = [],
//             rows;
//           for (var i = 0; i < events.length; i++) {
//             html.push(rowTpl(events[i].event));
//           }

//           rows = template(html.join(""));
//           document.querySelector('.event_json').innerHTML = rows;
//           document.querySelector('.content-header').querySelector('h1').innerHTML = 'Events';
        });
      }


    });


    page('/conception', function() {
      document.querySelector('.event_json').innerHTML = '';
      document.querySelector('.content-header')
        .querySelector('h1')
        .innerHTML = 'Dashboard';

    });

    page();
  }


  function conceptionInit() {
    routes();
  }



  return {
    conceptionInit: conceptionInit
  };

}());

$(function() {
  CONCEPTION.conceptionInit();

});