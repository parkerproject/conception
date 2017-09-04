'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var getEventInfo = function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(id) {
    var res;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return axios.get(BASE_EVENT_URL + id);

          case 2:
            res = _context.sent;
            return _context.abrupt('return', res.data);

          case 4:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, this);
  }));

  return function getEventInfo(_x) {
    return _ref.apply(this, arguments);
  };
}();

var getEvent = function () {
  var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(props) {
    var shows, onlyLiveEvents;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return Promise.all(props.data.map(function (show) {
              return getEventInfo(show);
            }));

          case 2:
            shows = _context2.sent;
            onlyLiveEvents = shows.filter(function (show) {
              return show.status === 'Live';
            });
            return _context2.abrupt('return', onlyLiveEvents);

          case 5:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));

  return function getEvent(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/* global Griddle React artists document ReactDOM axios */

var BASE_EVENT_URL = 'https://api.conceptionevents.com/api/event/';

var LinkComponent = function LinkComponent(props) {
  var url = '/artist/' + props.rowData.user_token;
  return React.createElement(
    'a',
    { href: url },
    props.data
  );
};

LinkComponent.propTypes = {
  rowData: React.PropTypes.shape({
    user_token: React.PropTypes.string
  }).isRequired,
  data: React.PropTypes.string.isRequired
};

var checkStatus = function checkStatus(props) {
  var status = props.data ? 'true' : 'false';
  return React.createElement(
    'span',
    null,
    status
  );
};

function showsComponent(props) {
  var events = getEvent(props);

  events.then(function (results) {
    results.forEach(function (result) {
      console.log(result.id, result.title, result.start_date);
      // const node = document.createElement('li');
      // const textnode = document.createTextNode(`${result.title} - ${result.start_date}`);
      // node.appendChild(textnode);                              // A
      document.getElementById('' + result.id).textContent = result.title + ' - ' + result.start_date;
    });
  });

  return React.createElement(
    'ul',
    null,
    props.data.map(function (data) {
      return React.createElement(
        'li',
        { id: data },
        '---'
      );
    })
  );
}

var columnMeta = [{
  columnName: 'full_name',
  customComponent: LinkComponent,
  displayName: 'Artist Name'
}, {
  columnName: 'email',
  displayName: 'Email'
}, {
  columnName: 'genre',
  displayName: 'Genre'
}, {
  columnName: 'approved',
  displayName: 'Approved',
  customComponent: checkStatus
}, {
  columnName: 'events',
  displayName: 'Events',
  customComponent: showsComponent
}];

var FilterArtist = function (_React$Component) {
  _inherits(FilterArtist, _React$Component);

  function FilterArtist(props) {
    _classCallCheck(this, FilterArtist);

    var _this = _possibleConstructorReturn(this, (FilterArtist.__proto__ || Object.getPrototypeOf(FilterArtist)).call(this, props));

    _this.state = { artists: artists };
    return _this;
  }

  _createClass(FilterArtist, [{
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement(Griddle, {
          results: this.state.artists,
          columns: ['full_name', 'email', 'approved', 'genre', 'events'],
          showFilter: true,
          resultsPerPage: 10,
          columnMetadata: columnMeta,
          showSettings: true
        })
      );
    }
  }]);

  return FilterArtist;
}(React.Component);

ReactDOM.render(React.createElement(FilterArtist, null), document.querySelector('#artist-table'));