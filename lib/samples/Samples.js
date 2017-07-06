'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _RaisedButton = require('material-ui/RaisedButton');

var _RaisedButton2 = _interopRequireDefault(_RaisedButton);

var _SimpleReactDropzone = require('../ui/SimpleReactDropzone');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//'simple-react-dropzone';

var Counter = function Counter(props) {
  return _react2.default.createElement(
    'span',
    null,
    props.counter,
    ' segundos'
  );
};

var Separator = function Separator(props) {
  return _react2.default.createElement(
    'div',
    null,
    _react2.default.createElement('br', null),
    _react2.default.createElement('hr', null),
    props.title
  );
};

var url = 'http://chicobento.synergia.dcc.ufmg.br:8082/';

var Samples = function (_Component) {
  _inherits(Samples, _Component);

  function Samples(props) {
    _classCallCheck(this, Samples);

    var _this = _possibleConstructorReturn(this, (Samples.__proto__ || Object.getPrototypeOf(Samples)).call(this, props));

    _this.state = {
      counter: 0,
      uploadState: {
        newUploadedFiles: [],
        alreadyAssociatedRemovedFiles: [],
        hasPendingUpload: false
      },
      uploadStateImediate: {
        newUploadedFiles: [],
        alreadyAssociatedRemovedFiles: [],
        hasPendingUpload: false
      },
      existingFiles: [{
        id: -1,
        name: "Filename",
        size: 12345,
        lastModifiedDate: new Date()
      }, {
        id: -2,
        name: "Filename 2",
        size: 123450,
        lastModifiedDate: new Date(),
        hideDeleteAction: true
      }],
      existingFiles2: [{
        id: -3,
        name: "Filename 3",
        size: 1234500,
        lastModifiedDate: new Date()
      }, {
        id: -4,
        name: "Filename 4",
        size: 12345000,
        lastModifiedDate: new Date()
        // hideDeleteAction: true,
      }]
    };
    return _this;
  }

  _createClass(Samples, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      var _this2 = this;

      var count = function count() {
        var incrementEmSegundos = 5;
        var counter = _this2.state.counter + incrementEmSegundos;
        _this2.setState({
          counter: counter
          // existingFiles: [
          //   {
          //     name: "Filename " + counter,
          //     size: counter * 1024,
          //   },
          // ],
        });
        setTimeout(count, incrementEmSegundos * 1000);
      };

      count();
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(Counter, { counter: this.state.counter }),
        _react2.default.createElement(Separator, { title: 'Exclus\xE3o ao salvar:' }),
        _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(_SimpleReactDropzone.SimpleReactDropzone, {
            uploadUrl: url,
            ref: function ref(_ref) {
              return _this3.refSimpleReactDropzone = _ref;
            },
            existingFiles: this.state.existingFiles2,
            imediateRemove: false,
            onChange: function onChange(e) {
              console.log('*** onChange (delayedRemove)', e);
              _this3.setState({ uploadState: _extends({}, e.newState) });
            }
          }),
          this.state.uploadState.newUploadedFiles.length > 0 && _react2.default.createElement(
            'div',
            null,
            'Arquivos adicionados (',
            this.state.uploadState.newUploadedFiles.length,
            '):',
            this.state.uploadState.newUploadedFiles.map(function (file, i) {
              return _react2.default.createElement(
                'div',
                { key: i },
                file.name
              );
            })
          ),
          this.state.uploadState.alreadyAssociatedRemovedFiles.length > 0 && _react2.default.createElement(
            'div',
            null,
            'Arquivos removidos (',
            this.state.uploadState.alreadyAssociatedRemovedFiles.length,
            '):',
            this.state.uploadState.alreadyAssociatedRemovedFiles.map(function (file, i) {
              return _react2.default.createElement(
                'div',
                { key: i },
                file.name
              );
            })
          ),
          _react2.default.createElement(
            'div',
            {
              style: {
                textAlign: 'right'
              }
            },
            _react2.default.createElement(_RaisedButton2.default, {
              label: 'Salvar',
              disabled: this.state.uploadState.hasPendingUpload,
              onTouchTap: function onTouchTap(e) {
                // this.setState({
                //   newUploadedFiles: [...this.refSimpleReactDropzone.newUploadedFiles],
                //   alreadyAssociatedRemovedFiles: [...this.refSimpleReactDropzone.alreadyAssociatedRemovedFiles],
                // });
              }
            }),
            _react2.default.createElement(_RaisedButton2.default, { label: 'Cancelar',
              onTouchTap: function onTouchTap(e) {
                _this3.refSimpleReactDropzone.reset();
              }
            })
          )
        ),
        _react2.default.createElement(Separator, { title: 'Exclus\xE3o imediata:' }),
        _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(_SimpleReactDropzone.SimpleReactDropzone, {
            uploadUrl: url,
            existingFiles: this.state.existingFiles,
            imediateRemove: true,
            onChange: function onChange(e) {
              console.log('*** onChange (uploadStateImediate)', e);
              _this3.setState({ uploadStateImediate: _extends({}, e.newState) });
            }
          })
        ),
        _react2.default.createElement(Separator, { title: 'Somente leitura:' }),
        _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(_SimpleReactDropzone.SimpleReactDropzone, {
            uploadUrl: url,
            existingFiles: this.state.existingFiles,
            imediateRemove: false,
            hideDeleteActions: true,
            disableAddActions: true
          })
        ),
        _react2.default.createElement(Separator, { title: 'Somente leitura vazio:' }),
        _react2.default.createElement(
          'div',
          null,
          _react2.default.createElement(_SimpleReactDropzone.SimpleReactDropzone, {
            uploadUrl: url,
            hideDeleteActions: true,
            disableAddActions: true
          })
        ),
        _react2.default.createElement(Counter, { counter: this.state.counter })
      );
    }
  }]);

  return Samples;
}(_react.Component);

exports.default = Samples;