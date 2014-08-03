var Templates = {};

Templates.dashboard = function() {

  var html = ['<div class="row"><div class="col-lg-4 col-xs-6">',
    '<div class="small-box bg-aqua"><div class="inner"><h3>0</h3><p>Attendees</p></div>',
    '<div class="icon"><i class="ion ion-bag"></i></div><a href="#" class="small-box-footer">',
    'More info <i class="fa fa-arrow-circle-right"></i></a></div></div>',
    '<div class="col-lg-4 col-xs-6"><div class="small-box bg-yellow">',
    '<div class="inner"><h3>0</h3><p>Artists Registrations</p></div><div class="icon">',
    '<i class="ion ion-person-add"></i></div><a href="#" class="small-box-footer">',
    'More info <i class="fa fa-arrow-circle-right"></i></a></div></div><div class="col-lg-4 col-xs-6">',
    '<div class="small-box bg-red"><div class="inner"><h3>0</h3><p>Tickets Sold</p></div>',
    '<div class="icon"><i class="ion ion-pie-graph"></i></div><a href="#" class="small-box-footer">',
    'More info <i class="fa fa-arrow-circle-right"></i></a></div></div></div>'
  ].join('');
	
	return html;
};