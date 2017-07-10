"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 * CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/* global FixedDataTable React artists */

var _FixedDataTable = FixedDataTable,
    Table = _FixedDataTable.Table,
    Column = _FixedDataTable.Column,
    Cell = _FixedDataTable.Cell;


var TextCell = function TextCell(_ref) {
  var rowIndex = _ref.rowIndex,
      data = _ref.data,
      col = _ref.col,
      props = _objectWithoutProperties(_ref, ["rowIndex", "data", "col"]);

  return React.createElement(
    Cell,
    props,
    data.getObjectAt(rowIndex)[col]
  );
};

var DataListWrapper = function () {
  function DataListWrapper(indexMap, data) {
    _classCallCheck(this, DataListWrapper);

    this._indexMap = indexMap;
    this._data = data;
  }

  _createClass(DataListWrapper, [{
    key: "getSize",
    value: function getSize() {
      return this._indexMap.length;
    }
  }, {
    key: "getObjectAt",
    value: function getObjectAt(index) {
      return this._data.getObjectAt(this._indexMap[index]);
    }
  }]);

  return DataListWrapper;
}();

var FilterArtist = function (_React$Component) {
  _inherits(FilterArtist, _React$Component);

  function FilterArtist(props) {
    _classCallCheck(this, FilterArtist);

    var _this = _possibleConstructorReturn(this, (FilterArtist.__proto__ || Object.getPrototypeOf(FilterArtist)).call(this, props));

    _this._dataList = artists;
    _this.state = {
      filteredDataList: _this._dataList
    };

    _this._onFilterChange = _this._onFilterChange.bind(_this);
    return _this;
  }

  _createClass(FilterArtist, [{
    key: "_onFilterChange",
    value: function _onFilterChange(e) {
      if (!e.target.value) {
        this.setState({
          filteredDataList: this._dataList
        });
      }

      var filterBy = e.target.value.toLowerCase();
      var size = this._dataList.getSize();
      var filteredIndexes = [];
      for (var index = 0; index < size; index++) {
        var _dataList$getObjectAt = this._dataList.getObjectAt(index),
            artistName = _dataList$getObjectAt.artistName;

        if (artistName.toLowerCase().indexOf(filterBy) !== -1) {
          filteredIndexes.push(index);
        }
      }

      this.setState({
        filteredDataList: new DataListWrapper(filteredIndexes, this._dataList)
      });
    }
  }, {
    key: "render",
    value: function render() {
      var filteredDataList = this.state.filteredDataList;

      return React.createElement(
        "div",
        null,
        React.createElement("input", {
          onChange: this._onFilterChange,
          placeholder: "Filter by First Name"
        }),
        React.createElement("br", null),
        React.createElement(
          Table,
          _extends({
            rowHeight: 50,
            rowsCount: filteredDataList.getSize(),
            headerHeight: 50,
            width: 1000,
            height: 500
          }, this.props),
          React.createElement(Column, {
            header: React.createElement(
              Cell,
              null,
              "Name"
            ),
            cell: React.createElement(TextCell, { data: filteredDataList, col: "artistName" }),
            fixed: true,
            width: 100
          }),
          React.createElement(Column, {
            header: React.createElement(
              Cell,
              null,
              "Email"
            ),
            cell: React.createElement(TextCell, { data: filteredDataList, col: "email" }),
            fixed: true,
            width: 100
          }),
          React.createElement(Column, {
            header: React.createElement(
              Cell,
              null,
              "Genre"
            ),
            cell: React.createElement(TextCell, { data: filteredDataList, col: "genre" }),
            width: 100
          }),
          React.createElement(Column, {
            header: React.createElement(
              Cell,
              null,
              "Booker"
            ),
            cell: React.createElement(TextCell, { data: filteredDataList, col: "booker" }),
            width: 200
          }),
          React.createElement(Column, {
            header: React.createElement(
              Cell,
              null,
              "Approved"
            ),
            cell: React.createElement(TextCell, { data: filteredDataList, col: "approved" }),
            width: 200
          }),
          React.createElement(Column, {
            header: React.createElement(
              Cell,
              null,
              "Status 2"
            ),
            cell: React.createElement(TextCell, { data: filteredDataList, col: "status" }),
            width: 200
          }),
          React.createElement(Column, {
            header: React.createElement(
              Cell,
              null,
              "Notes"
            ),
            cell: React.createElement(TextCell, { data: filteredDataList, col: "notes" }),
            width: 200
          })
        )
      );
    }
  }]);

  return FilterArtist;
}(React.Component);

module.exports = FilterArtist;