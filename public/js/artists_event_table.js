'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* global Griddle React artists document ReactDOM location axios */

// https://admin.conceptionevents.com/34934696618/artist/Ui9Uvn4sXP
var BASE_URL = 'https://api.conceptionevents.com/api';
var showId = location.pathname.split('/')[2];

var LinkComponent = function LinkComponent(props) {
  var url = '/' + showId + '/artist/' + props.rowData.user_token;
  return React.createElement(
    'a',
    { href: url },
    props.data
  );
};

var checkStatus = function checkStatus(props) {
  var status = props.data ? 'true' : 'false';
  return React.createElement(
    'span',
    null,
    status
  );
};

var textComponent = function (_React$Component) {
  _inherits(textComponent, _React$Component);

  function textComponent() {
    _classCallCheck(this, textComponent);

    return _possibleConstructorReturn(this, (textComponent.__proto__ || Object.getPrototypeOf(textComponent)).apply(this, arguments));
  }

  _createClass(textComponent, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this2 = this;

      axios.get(BASE_URL + '/artist/record?userToken=' + this.props.rowData.user_token + '&eventId=' + showId).then(function (res) {
        _this2.setState({ data: res.data });
      }).catch(function (err) {
        return console.log(err);
      });
    }
  }, {
    key: 'render',
    value: function render() {
      if (!this.state) {
        return React.createElement('span', null);
      }
      var columnName = this.props.metadata.columnName;

      return React.createElement(
        'span',
        null,
        this.state.data[columnName]
      );
    }
  }]);

  return textComponent;
}(React.Component);

var tixComponent = function (_React$Component2) {
  _inherits(tixComponent, _React$Component2);

  function tixComponent() {
    _classCallCheck(this, tixComponent);

    return _possibleConstructorReturn(this, (tixComponent.__proto__ || Object.getPrototypeOf(tixComponent)).apply(this, arguments));
  }

  _createClass(tixComponent, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this4 = this;

      axios.get(BASE_URL + '/attendees/' + showId).then(function (res) {
        //  this.setState({ data: res.data });
        var attendees = res.data;
        var sales = attendees.filter(function (obj) {
          return obj.attendee.affiliate === _this4.props.rowData.user_token;
        });
        _this4.setState({ sales: sales });
      }).catch(function (err) {
        return console.log(err);
      });
    }
  }, {
    key: 'render',
    value: function render() {
      if (!this.state) {
        return React.createElement(
          'span',
          { style: { color: 'red' } },
          'calculating tix...'
        );
      }
      // const { columnName } = this.props.metadata;
      return React.createElement(
        'span',
        null,
        this.state.sales.length
      );
    }
  }]);

  return tixComponent;
}(React.Component);

LinkComponent.propTypes = {
  rowData: React.PropTypes.shape({
    user_token: React.PropTypes.string
  }).isRequired,
  data: React.PropTypes.string.isRequired
};

var columnMeta = [{
  columnName: 'full_name',
  customComponent: LinkComponent,
  displayName: 'Artist Name'
}, {
  columnName: 'email',
  displayName: 'Email'
}, {
  columnName: 'booker',
  displayName: 'Booker',
  customComponent: textComponent
}, {
  columnName: 'tix',
  displayName: 'Tickets',
  customComponent: tixComponent
}, {
  columnName: 'status_2',
  displayName: 'Status 2',
  customComponent: textComponent
}, {
  columnName: 'notes',
  displayName: 'Notes',
  customComponent: textComponent
}, {
  columnName: 'approved',
  displayName: 'Approved',
  customComponent: checkStatus
}];

var FilterArtist = function (_React$Component3) {
  _inherits(FilterArtist, _React$Component3);

  function FilterArtist(props) {
    _classCallCheck(this, FilterArtist);

    var _this5 = _possibleConstructorReturn(this, (FilterArtist.__proto__ || Object.getPrototypeOf(FilterArtist)).call(this, props));

    _this5.state = { artists: [] };
    return _this5;
  }

  _createClass(FilterArtist, [{
    key: 'componentWillMount',
    value: function componentWillMount() {
      var _this6 = this;

      axios.get(BASE_URL + '/all_artists/' + showId).then(function (res) {
        _this6.setState({ artists: res.data });
      }).catch(function (err) {
        return console.log(err);
      });
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement(Griddle, {
          results: this.state.artists,
          columns: ['full_name', 'email', 'approved', 'booker', 'status', 'notes', 'tix'],
          showFilter: true,
          resultsPerPage: 10,
          columnMetadata: columnMeta
        })
      );
    }
  }]);

  return FilterArtist;
}(React.Component);

ReactDOM.render(React.createElement(FilterArtist, null), document.querySelector('#artist-event-table'));