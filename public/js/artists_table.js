'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* global Griddle React artists document ReactDOM */

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
          columns: ['full_name', 'email', 'approved', 'genre'],
          showFilter: true,
          resultsPerPage: 10,
          columnMetadata: columnMeta
        })
      );
    }
  }]);

  return FilterArtist;
}(React.Component);

ReactDOM.render(React.createElement(FilterArtist, null), document.querySelector('#artist-table'));