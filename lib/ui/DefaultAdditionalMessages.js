'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.noneFilesDefaultMessage = exports.reactDragAndClickDefaultMessage = undefined;

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _DefaultIcons = require('./DefaultIcons');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var uploadIcon = _DefaultIcons.defaultIcons.react.uploadIcon;

var reactDragAndClickDefaultMessage = exports.reactDragAndClickDefaultMessage = _react2.default.createElement(
  'div',
  null,
  _react2.default.createElement(
    'div',
    null,
    uploadIcon
  ),
  _react2.default.createElement(
    'div',
    null,
    'Arraste arquivos aqui para anexa-los ou click aqui.'
  )
);

var noneFilesDefaultMessage = exports.noneFilesDefaultMessage = 'Nenhum arquivo enviado';