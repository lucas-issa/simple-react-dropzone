'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ReduxFormFieldSimpleReactDropzone = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reduxForm = require('redux-form');

var _SimpleReactDropzone = require('./SimpleReactDropzone');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var errorStyle = {
  color: 'rgb(244, 67, 54)',
  fontSize: 12,
  paddingTop: 2
};

var validadeRequired = function validadeRequired(value, existingFiles) {
  var _ref = value || {},
      newUploadedFiles = _ref.newUploadedFiles,
      alreadyAssociatedRemovedFiles = _ref.alreadyAssociatedRemovedFiles;

  var existingFilesCount = existingFiles ? existingFiles.length : 0;
  var newUploadedFilesCount = newUploadedFiles ? newUploadedFiles.length : 0;
  var alreadyAssociatedRemovedFilesCount = alreadyAssociatedRemovedFiles ? alreadyAssociatedRemovedFiles.length : 0;

  var filesCount = existingFilesCount - alreadyAssociatedRemovedFilesCount + newUploadedFilesCount;

  return filesCount > 0 ? undefined : 'Campo obrigatório';
};

var SimpleReactDropzoneForReduxForm = function (_React$Component) {
  _inherits(SimpleReactDropzoneForReduxForm, _React$Component);

  function SimpleReactDropzoneForReduxForm() {
    var _ref2;

    var _temp, _this, _ret;

    _classCallCheck(this, SimpleReactDropzoneForReduxForm);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref2 = SimpleReactDropzoneForReduxForm.__proto__ || Object.getPrototypeOf(SimpleReactDropzoneForReduxForm)).call.apply(_ref2, [this].concat(args))), _this), _this.state = {
      hasPendingUpload: false
    }, _this.onChange = function (_ref3) {
      var newState = _ref3.newState;
      var _this$props$input = _this.props.input,
          onChange = _this$props$input.onChange,
          onBlur = _this$props$input.onBlur;

      var hasPendingUpload = newState.hasPendingUpload,
          otherNewStates = _objectWithoutProperties(newState, ['hasPendingUpload']);

      var newHasPendingUpload = !hasPendingUpload ? undefined : hasPendingUpload;

      if (_this.state.hasPendingUpload !== hasPendingUpload) {
        _this.setState({ hasPendingUpload: hasPendingUpload });
      }
      var newValue = _extends({}, otherNewStates, {

        // se for falso, deve ser undefined para permitir
        // desabilitar o salvar quando o formulario voltar para o valor inicial.
        hasPendingUpload: newHasPendingUpload
      });
      onBlur();
      onChange(newValue);
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(SimpleReactDropzoneForReduxForm, [{
    key: 'render',
    value: function render() {
      var hasPendingUpload = this.state.hasPendingUpload;
      var _props$meta = this.props.meta,
          touched = _props$meta.touched,
          invalid = _props$meta.invalid,
          error = _props$meta.error;


      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(_SimpleReactDropzone.SimpleReactDropzone, _extends({}, this.props, {
          onChange: this.onChange
        })),
        touched && !hasPendingUpload && invalid && _react2.default.createElement(
          'div',
          { style: errorStyle },
          error
        )
      );
    }
  }]);

  return SimpleReactDropzoneForReduxForm;
}(_react2.default.Component);

var ReduxFormFieldSimpleReactDropzone = exports.ReduxFormFieldSimpleReactDropzone = function ReduxFormFieldSimpleReactDropzone(props) {
  return _react2.default.createElement(_reduxForm.Field, _extends({}, props, {
    component: SimpleReactDropzoneForReduxForm,
    validate: function validate(value) {
      return props.required && validadeRequired(value, props.existingFiles);
    }
  }));
};

ReduxFormFieldSimpleReactDropzone.propTypes = {
  name: _propTypes2.default.string.isRequired,
  required: _propTypes2.default.bool,
  uploadUrl: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.func]),
  uploadParams: _propTypes2.default.object,
  existingFiles: _propTypes2.default.array,
  imediateRemove: _propTypes2.default.bool,
  maxFilesize: _propTypes2.default.number,
  maxFiles: _propTypes2.default.number
};