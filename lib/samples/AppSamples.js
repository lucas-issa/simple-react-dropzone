'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _MuiThemeProvider = require('material-ui/styles/MuiThemeProvider');

var _MuiThemeProvider2 = _interopRequireDefault(_MuiThemeProvider);

var _reactTapEventPlugin = require('react-tap-event-plugin');

var _reactTapEventPlugin2 = _interopRequireDefault(_reactTapEventPlugin);

var _TextField = require('material-ui/TextField');

var _TextField2 = _interopRequireDefault(_TextField);

var _Samples = require('./Samples');

var _Samples2 = _interopRequireDefault(_Samples);

require('../ui/css/filepicker.css');

require('../ui/css/dropzone.css');

require('../ui/css/SimpleReactDropzone-wesley.css');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
(0, _reactTapEventPlugin2.default)();

var AppSamples = function (_Component) {
  _inherits(AppSamples, _Component);

  function AppSamples() {
    _classCallCheck(this, AppSamples);

    return _possibleConstructorReturn(this, (AppSamples.__proto__ || Object.getPrototypeOf(AppSamples)).apply(this, arguments));
  }

  _createClass(AppSamples, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
          _MuiThemeProvider2.default,
          null,
          _react2.default.createElement(
            'div',
            { className: 'App' },
            _react2.default.createElement(_TextField2.default, { floatingLabelText: 'Teste', fullWidth: true }),
            _react2.default.createElement(_Samples2.default, null)
          )
        )
      );
    }
  }]);

  return AppSamples;
}(_react.Component);

exports.default = AppSamples;