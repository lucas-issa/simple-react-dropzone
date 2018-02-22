'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SimpleReactDropzone = undefined;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
// import 'react-dropzone-component/styles/filepicker.css';
// import 'dropzone/dist/dropzone.css';
// import './SimpleReactDropzone.css';


var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _DefaultIcons = require('./DefaultIcons');

var _DefaultAdditionalMessages = require('./DefaultAdditionalMessages');

var _DefaultTranslation = require('./DefaultTranslation');

var _DefaultPreviewTemplate = require('./DefaultPreviewTemplate');

var _reactDropzoneComponent = require('react-dropzone-component');

var _reactDropzoneComponent2 = _interopRequireDefault(_reactDropzoneComponent);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _isEqual = require('lodash/isEqual');

var _isEqual2 = _interopRequireDefault(_isEqual);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

// TODO geral: Talvez colocar um "processando..." para esperar excluir o arquivo no servidor.


var idCompCounter = 0;

var hasStaticInitialize = false;
function staticInitialization(Dropzone) {
  if (!hasStaticInitialize) {
    Dropzone.confirm = SimpleReactDropzone.confirm;
    hasStaticInitialize = true;
  }
}

var htmlDeleteIcon = _DefaultIcons.defaultIcons.html.deleteIcon;
var htmlDeleteForeverIcon = _DefaultIcons.defaultIcons.html.deleteForeverIcon;

var componentConfig = {
  // iconFiletypes: ['.jpg', '.png', '.gif'],
  // showFiletypeIcon: true,
  // postUrl: 'http://localhost:8080/', // '/uploadHandler',
};
var djsConfig = _extends({
  // url: 'teste',
  // autoProcessQueue: false,
  // addRemoveLinks: true,
  previewTemplate: _DefaultPreviewTemplate.defaultPreviewTemplate
}, _DefaultTranslation.defaultTranslation);

/**
 * Utiliza o componente ReactDropzone para implementar dois comportamentos simples
 * pré-definidos de envio de arquivos.
 *
 * A propriedade imediateRemove irá definir como o componente deve comportar.
 * Veja a documentação dessa propriedade para entender as dois modos de operação do componente.
 *
 *
 * Para alterar a janela de confirmação do componente, altere o método SimpleReactDropzone.confim.
 * Veja a documentação na própria variável estática: SimpleReactDropzone.confim.
 */

var SimpleReactDropzone = exports.SimpleReactDropzone = function (_React$PureComponent) {
  _inherits(SimpleReactDropzone, _React$PureComponent);

  /**
   * Necessário para identificar unicamente o componente e conseguir usar expressões
   * para localizar os elementos que devem ser clicaveis.
   */


  /**
   * A função pode ser alterada para implementar uma modal de confirmação personalizada.
   *
   * Essa função é compartilhada entre todas as instâncias deste componente.
   * A nova função deve ser atribuida antes de montar o primeiro componente.
   *
   * Documentação original para implementação do método:
   * Ask the question, and call accepted() or rejected() accordingly.
   * CAREFUL: rejected might not be defined. Do nothing in that case.
   *
   * @param question
   * @param accepted
   * @param rejected
   * @returns {*}
   */
  function SimpleReactDropzone(props) {
    _classCallCheck(this, SimpleReactDropzone);

    var _this = _possibleConstructorReturn(this, (SimpleReactDropzone.__proto__ || Object.getPrototypeOf(SimpleReactDropzone)).call(this, props));

    _initialiseProps.call(_this);

    _this.idComp = ++idCompCounter;
    _this.eventHandlers = {
      init: function init(myDropzone) {
        _this.dropzoneInit(myDropzone);
      }
    };

    _this.calculateAndSetMaxFiles(props);
    return _this;
  }

  /**
   * Needs a internal value because existing files has to be subtracted.
   */


  _createClass(SimpleReactDropzone, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (!(0, _isEqual2.default)(this.props.existingFiles, nextProps.existingFiles)) {
        this.clearAlreadyAssociatedFiles();
        this.setExistingFiles(nextProps.existingFiles);
        this.calculateAndSetMaxFiles(nextProps);
        this.fireChangeEvent('setExistingFiles', nextProps.existingFiles);
      }

      if (this.props.disableAddActions !== nextProps.disableAddActions) {
        this.setDisableAddActions(nextProps);
      }
    }
  }, {
    key: 'render',
    value: function render() {

      var localConfig = _extends({}, componentConfig, this.props.config, {
        postUrl: this.props.uploadUrl
      });

      var localEventHandlers = _extends({}, this.eventHandlers, this.props.eventHandlers);

      var customContainerId = 'dz-container-' + this.idComp;
      var customMesgId = 'dz-custom-mesg-' + this.idComp;
      var clickable = ['#' + customContainerId + '>.dropzone', '#' + customMesgId];
      // console.log(clickable);

      var localDjsConfig = _extends({
        // url: this.props.uploadUrl,
        params: this.props.uploadParams,
        // Necessário para ser possível clicar na mensagem e selecionar o arquivo.
        clickable: clickable
      }, djsConfig, this.props.djsConfig, {
        maxFiles: this.internalMaxFiles,
        maxFilesize: this.props.maxFilesize
      });

      var defaultMessage = _react2.default.createElement(
        'div',
        {
          id: '' + customMesgId,
          style: { paddingTop: 10 }
        },
        this.props.dragAndClickMessage || _DefaultAdditionalMessages.reactDragAndClickDefaultMessage
      );

      if (this.props.disableAddActions) {
        localDjsConfig.clickable = false;
        localDjsConfig.dictDefaultMessage = '';
        if (!this.props.existingFiles || this.props.existingFiles.length === 0) {
          defaultMessage = _react2.default.createElement(
            'div',
            { style: { paddingTop: 35 } },
            this.props.noneFilesMessage || _DefaultAdditionalMessages.noneFilesDefaultMessage
          );
        } else {
          defaultMessage = '';
        }
      }

      if (this.props.imediateRemove) {
        localDjsConfig.dictRemoveFileConfirmation = 'Tem certeza que deseja remover este arquivo?';
      }

      var readOnlyClassName = void 0;
      if (this.props.disableAddActions && this.props.hideDeleteActions) {
        readOnlyClassName = 'srdz-readOnly';
      }

      // console.log('localDjsConfig: ', localDjsConfig);

      return _react2.default.createElement(
        'span',
        {
          id: customContainerId,
          className: readOnlyClassName
        },
        _react2.default.createElement(
          _reactDropzoneComponent2.default,
          {
            config: localConfig,
            eventHandlers: localEventHandlers,
            djsConfig: localDjsConfig
          },
          defaultMessage
        )
      );
    }
  }]);

  return SimpleReactDropzone;
}(_react2.default.PureComponent);

SimpleReactDropzone.confirm = function (question, accepted, rejected) {

  if (window.confirm(question)) {
    // return accepted();
    // O setTimeout é necessário para permitir que o cancelamento de uploado funcione
    // corretamente. Sem o setTimeout o envio pode não ser cancelado no seguinte caso:
    // Quando o upload finaliza antes do usuário confirmar. Neste caso, usando o setTimeout
    // o arquivo terminará o upload, mas será excluído assim que o usuário confirmar.
    setTimeout(accepted);
  } else if (rejected != null) {
    return rejected();
  }
};

var _initialiseProps = function _initialiseProps() {
  var _this2 = this;

  this.existingFilesCopy = [];
  this.newUploadedFiles = [];
  this.alreadyAssociatedRemovedFiles = [];
  this.filesToDelete = [];

  this.calculateAndSetMaxFiles = function (props) {
    if (props.maxFiles) {
      var existingFileCount = props.existingFiles ? props.existingFiles.length : 0;
      var removedExistingFilesCount = _this2.alreadyAssociatedRemovedFiles ? _this2.alreadyAssociatedRemovedFiles.length : 0;
      _this2.internalMaxFiles = props.maxFiles - (existingFileCount - removedExistingFilesCount);
      if (_this2.myDropzone) {
        _this2.myDropzone.options.maxFiles = _this2.internalMaxFiles;
      }
    }
  };

  this.dropzoneInit = function (myDropzone) {

    staticInitialization(myDropzone.constructor);

    // console.log('dropzone.init: ', myDropzone);

    _this2.myDropzone = myDropzone;
    setTimeout(function () {
      _this2.setExistingFiles(_this2.props.existingFiles);
    });

    _this2.setDisableAddActions(_this2.props);

    myDropzone.on('addedfile', function (file) {

      // console.log('addedfile: ', file);

      if (typeof file.lastModifiedDate === 'string') {
        file.lastModifiedDate = new Date(file.lastModifiedDate);
      }

      _this2.setDownloadLink(file);

      if (_this2.props.hideDeleteActions || file.hideDeleteAction) {
        var deleteActionElement = file.previewElement.querySelector("div[data-dz-remove]");
        if (deleteActionElement) {
          deleteActionElement.parentNode.removeChild(deleteActionElement);
        }
      } else {

        var _deleteActionElement = file.previewElement.querySelector("div[data-dz-remove]");
        if (_deleteActionElement) {
          if (_this2.props.imediateRemove) {
            _deleteActionElement.innerHTML += _this2.props.htmlDeleteForeverIcon || htmlDeleteForeverIcon;
          } else {
            _deleteActionElement.innerHTML += _this2.props.htmlDeleteIcon || htmlDeleteIcon;
          }
        }
      }

      if (file.lastModifiedDate) {
        var dateElement = file.previewElement.querySelector("[data-dz-date]");
        if (dateElement) {
          dateElement.innerHTML = file.lastModifiedDate.toLocaleString();
        }
      }

      _this2.calculateAndSetMaxFiles(_this2.props);
      _this2.fireChangeEvent('addedfile', file);
    });

    myDropzone.on('removedfile', function (file) {

      var originalEventName = 'removedfile';
      var internalEventName = originalEventName;
      function defineInternalEventName(state) {
        if (state) {
          internalEventName = originalEventName + '.' + state;
        } else {
          internalEventName = originalEventName;
        }
      }

      var removeFileFromServer = function removeFileFromServer(file) {

        var removeFromServer = false;

        if (!_this2.clearingAlreadyAssociatedFiles) {
          if (file.status !== 'canceled') {
            if (_this2.props.imediateRemove && file.errorOnDeleteFromServer) {
              removeFromServer = true;
            } else if (file.status !== 'error') {
              removeFromServer = true;
            }
          }
        }

        if (removeFromServer) {
          defineInternalEventName('removeFromServer');
          _this2.deleteFileFromServer(file);
        }
      };

      if (_this2.props.imediateRemove) {
        removeFileFromServer(file);
      } else {
        if (!file.alreadyAssociated) {
          removeFileFromServer(file);

          var indexToRemove = _this2.newUploadedFiles.indexOf(file);
          if (indexToRemove > -1) {
            _this2.newUploadedFiles.splice(indexToRemove, 1);
          }
        } else {
          if (!_this2.clearingAlreadyAssociatedFiles) {
            _this2.alreadyAssociatedRemovedFiles.push(file);
          }
        }
      }
      // console.log('removedfile: ', file);
      if (file.status === 'canceled') {
        defineInternalEventName(file.status);
      }
      _this2.calculateAndSetMaxFiles(_this2.props);
      _this2.fireChangeEvent(internalEventName, file);
    });

    myDropzone.on('success', function (file, response) {

      if (file.xhr && file.xhr.status === 200 || file.status === 'success' // To support fake upload
      ) {
          var jsonResponse = response; // JSON.parse(response);
          if (jsonResponse.id !== undefined) {
            file.id = jsonResponse.id;
          }

          _this2.setDownloadLink(file);
        }

      if (!_this2.props.imediateRemove) {
        _this2.newUploadedFiles.push(file);
      }

      // console.log('success, file: ', file, ', response: ', response);

      _this2.fireChangeEvent('success', file);
    });

    // myDropzone.on('error', (file, errorMessage) => {
    //   // console.log('error, file: ', file, ', errorMessage: ', errorMessage);
    //   this.fireChangeEvent('error', file);
    // });
    //
  };

  this.deleteFileFromServer = function (file) {
    var deleteUrl = _this2.props.deleteUrl ? _this2.props.deleteUrl : _this2.props.uploadUrl;

    if (deleteUrl) {

      var onError = function onError(error) {
        file.errorOnDeleteFromServer = true;
        _this2.myDropzone.emit('addedfile', file);
        _this2.myDropzone.emit("error", file, error);
        _this2.myDropzone.emit("complete", file);
      };

      var onSuccess = function onSuccess() {
        var i = _this2.filesToDelete.indexOf(file);
        if (i !== -1) {
          _this2.filesToDelete.splice(i, 1);
        }
        _this2.fireChangeEvent('removefileOnServer.finish', file);
      };

      var params = _extends({}, _this2.props.uploadParams, {
        fileId: file.id,
        fileName: file.name
      });

      if (typeof deleteUrl === 'function') {
        deleteUrl(params, onSuccess, onError);
      } else {
        var i = _this2.filesToDelete.indexOf(file);
        if (i === -1) {
          _this2.filesToDelete.push(file);
        }
        _this2.fireChangeEvent('removefileOnServer.start', file);
        _axios2.default.delete(deleteUrl, { params: params }).then(onSuccess, onError);
      }
    }
  };

  this.clearAlreadyAssociatedFiles = function () {
    // for (let file of this.props.existingFiles) {
    //   this.myDropzone.emit("removeFile", file);
    //   // this.myDropzone.removeFile(file);
    // }
    // this.myDropzone.emit("removeAllFiles");

    _this2.clearingAlreadyAssociatedFiles = true;
    if (_this2.existingFilesCopy) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = _this2.existingFilesCopy[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var file = _step.value;

          _this2.myDropzone.emit("removedfile", file);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      _this2.existingFilesCopy.slice(0, _this2.existingFilesCopy.length);
    }
    delete _this2.clearingAlreadyAssociatedFiles;

    // this.newUploadedFiles.splice(0,this.newUploadedFiles.length);
    // this.alreadyAssociatedRemovedFiles.splice(0,this.alreadyAssociatedRemovedFiles.length);

    // this.myDropzone.removeAllFiles();
    // this.myDropzone.removeAllFiles(true);
  };

  this.setExistingFiles = function (existingFiles) {
    if (existingFiles) {
      _this2.isChangingFiles = true;

      _this2.existingFilesCopy = existingFiles.map(function (existingFile) {
        return _extends({}, existingFile, {
          alreadyAssociated: true,
          type: ''
        });
      });
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = _this2.existingFilesCopy[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var existingFile = _step2.value;

          // this.myDropzone.addFile(existingFile);
          _this2.myDropzone.emit("addedfile", existingFile);

          // And optionally show the thumbnail of the file:
          //     myDropzone.emit("thumbnail", mockFile, "/image/url");
          // Or if the file on your server is not yet in the right
          // size, you can let Dropzone download and resize it
          // callback and crossOrigin are optional.
          // myDropzone.createThumbnailFromUrl(file, imageUrl, callback, crossOrigin);

          // Make sure that there is no progress bar, etc...
          _this2.myDropzone.emit("complete", existingFile);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      delete _this2.isChangingFiles;
    }
  };

  this.setDownloadLink = function (file) {

    var downloadUrl = _this2.props.downloadUrl ? _this2.props.downloadUrl : _this2.props.uploadUrl;

    var linkElementContainer = file.previewElement.querySelector("div.dz-filename");
    var linkElement = linkElementContainer.querySelector("a.downloadLink");
    if (file.id) {
      var downloadUrlType = typeof downloadUrl === 'undefined' ? 'undefined' : _typeof(downloadUrl);
      if (downloadUrlType === 'string') {
        linkElement.href = downloadUrl + '?fileId=' + file.id + '&fileName=' + file.name;
      } else if (downloadUrlType === 'function') {
        linkElement.onclick = function () {
          downloadUrl(file);
        };
      } else {
        console.error('downloadUrl property must be a string or a function');
      }
    }
  };

  this.setDisableAddActions = function (props) {
    if (_this2.props.disableAddActions) {
      _this2.myDropzone.removeEventListeners();
    } else {
      _this2.myDropzone.setupEventListeners();
    }
  };

  this.reset = function () {
    _this2.isChangingFiles = true;

    if (_this2.myDropzone.files) {
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = _this2.myDropzone.files[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var file = _step3.value;

          if (!file.alreadyAssociated) {
            file.status = 'canceled'; // Remove sem remover do servidor
            _this2.myDropzone.removeFile(file);
          }
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }
    _this2.newUploadedFiles.splice(0, _this2.newUploadedFiles.length);

    if (_this2.alreadyAssociatedRemovedFiles) {
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = _this2.alreadyAssociatedRemovedFiles[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var _file = _step4.value;

          _this2.myDropzone.emit("addedfile", _file);
          _this2.myDropzone.emit("complete", _file);
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4.return) {
            _iterator4.return();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }
    }
    _this2.alreadyAssociatedRemovedFiles.splice(0, _this2.alreadyAssociatedRemovedFiles.length);

    if (_this2.filesToDelete) {
      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = _this2.filesToDelete[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var _file2 = _step5.value;

          console.log('reset, cancel: ', _file2);
          _file2.status = 'canceled'; // Remove sem remover do servidor
          _this2.myDropzone.emit("removedfile", _file2);
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5.return) {
            _iterator5.return();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }
    }
    _this2.filesToDelete.splice(0, _this2.filesToDelete.length);

    delete _this2.isChangingFiles;

    _this2.fireChangeEvent('reset', _this2.props.existingFiles);
  };

  this.fireChangeEvent = function (event, target) {
    if (!_this2.isChangingFiles) {

      // let info = {
      //   // getAcceptedFiles: this.myDropzone.getAcceptedFiles().length,
      //   getUploadingFiles: this.myDropzone.getUploadingFiles().length,
      //   getQueuedFiles: this.myDropzone.getQueuedFiles().length,
      //   getRejectedFiles: this.myDropzone.getRejectedFiles().length,
      //   filesToDelete: this.filesToDelete.length,
      //   files: this.myDropzone.files.length,
      // };
      // console.log('info: ', info);

      var toIdList = function toIdList(fileList) {
        return fileList && fileList.map(function (file) {
          return file.id;
        });
      };

      _this2.props.onChange({
        event: event,
        target: target,
        newState: {
          alreadyAssociatedRemovedFiles: toIdList(_this2.alreadyAssociatedRemovedFiles),
          newUploadedFiles: toIdList(_this2.newUploadedFiles),
          hasPendingUpload: _this2.myDropzone.getUploadingFiles().length > 0 || _this2.myDropzone.getQueuedFiles().length > 0 || _this2.myDropzone.getRejectedFiles().length > 0 || _this2.filesToDelete.length > 0
          // info,
        }
      });
    }
  };
};

SimpleReactDropzone.propTypes = {

  /**
   * URL to send the file. Will use POST method.
   */
  uploadUrl: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.func]),
  /**
   * Params to send together with the file.
   */
  uploadParams: _propTypes2.default.object,

  /**
   * Default: uploadUrl, but will use GET method and will add fileId parameter.
   */
  downloadUrl: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.func]),

  /**
   * Default: uploadUrl, but will use DELETE method and will add fileId parameter.
   */
  deleteUrl: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.func]),

  /**
   * Um array de arquivos que devem ser exibidos inicialmente no componente.
   *
   */
  existingFiles: _propTypes2.default.arrayOf(_propTypes2.default.shape({
    id: _propTypes2.default.number.isRequired,
    name: _propTypes2.default.string.isRequired,
    lastModifiedDate: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.instanceOf(Date)]).isRequired,
    size: _propTypes2.default.number
  })),

  /**
   * O modo de operação que o componente deve funcionar.
   *
   * Ser for verdadeiro as operações de adicionar ou excluir arquivos serão excutadas
   * imediatemente no servidor.
   *
   * Ser for falso as operações podem não ser executadas imediatamente no servidor.
   * Para os arquivos informados na propriedade existingFiles, nenhuma operação é executada.
   * Os arquivos adicionados pelo usuário são enviados para o servidor imediatamente mas não
   * devem ser associados à entidade do sistema. Se estes arquivos forem excluídos pelo usuário
   * antes deles serem associados a alguma entidade do sistema (ou seja, serem transformados em
   * "existingFiles"), eles serão excluídos imediatamente do servidor e mais nada precisa ser feito
   * a respeito deste arquivo.
   * A medida que o usuário for adicionando ou removendo arquivos, a função informada na propriedade
   * onChange será notificada das operação sobre arquivos que ainda não foram realizadas e estão
   * pendentes, ou seja, quais arquivos já foram enviados para o servidor e ainda não foram
   * vinculados a entidade do sistema e quais arquivos estão vinculados e devem ser excluídos.
   * Dessa forma é possível implementar o envio e exclusão de arquivos junto com outros campos
   * de um formulário salvando ou cancelando a edição do formulário (e arquivos) quando o usuário
   * desejar.
   *
   * Valor padrão: verdadeiro.
   */
  imediateRemove: _propTypes2.default.bool,

  /**
   * Esconde os comandos de exclusão de arquivos.
   */
  hideDeleteActions: _propTypes2.default.bool,

  /**
   * Não permite adicionar novos arquivos. Esta propriedade deve ser usada no caso de listar
   * os arquivos existentes sem permitir adicionar novos.
   *
   * Essa propriedade não deve ser usada para limitar a quantidade máxima de arquivos que
   * podem ser enviados. Neste caso use a propriedade maxFiles.
   */
  disableAddActions: _propTypes2.default.bool,

  /**
   * Limita o tamanho máximo (em bytes) que o arquivo a ser enviado pode ter.
   */
  maxFilesize: _propTypes2.default.number,
  /**
   * Limita a quantidade máxima de arquivos que podem ser enviados.
   * Valor padrão: null, ou seja, ilimitado.
   */
  maxFiles: _propTypes2.default.number,

  /**
   * Escuta as alterações nos arquivos feitas pelo usuário.
   * Deve ser usado em conjunto com a propriedade "imediateRemove={false}".
   *
   * Será através dessa função que será possível identificar quais arquivos foram:
   *  - adicionados para vincula-los à entidade do sistema e
   *  - removidos para desvincula-los da entidade do sistema e exclui-lo fisicamente do servidor.
   *
   * Parâmetros dessa função:
   *  - event: O evento que causou a alteração. Alguns possíveis eventos:
   *    addedfile, success, removedfile, removefileOnServer.start, removedfile.removeFromServer,
   *    removefileOnServer.finish e outros...
   *  - target: O arquivo ou um array de arquivos que causaram o disparo do evento.
   *  - newState: Objeto com as seguintes propriedades:
   *    - alreadyAssociatedRemovedFiles: Array com os arquivos que estão no servidor e devem ser
   *      excluídos.
   *    - newUploadedFiles: Array com os novos arquivos que foram enviados para o servidor e
   *      devem ser associados a alguma entidade do sistema.
   *    - hasPendingUpload: Verdadeiro se existe algum envio de arquivo em andamento ou pendente.
   */
  onChange: _propTypes2.default.func,

  /**
   * Altera o icone padrão para remover arquivo (não imediatamente).
   * Deve ser uma string com o HTML que irá exibir o icone.
   */
  htmlDeleteIcon: _propTypes2.default.string,
  /**
   * Altera o icone padrão para remover arquivo (imediatamente).
   * Deve ser uma string com o HTML que irá exibir o icone.
   */
  htmlDeleteForeverIcon: _propTypes2.default.string,

  /**
   * Altera a mensagem padrão exibida pelo componente que orientar o usuário como fazer o upload de
   * arquivo.
   */
  dragAndClickMessage: _propTypes2.default.node,

  /**
   * Altera a mensagem padrão exibida pelo componente quando não tem nenhum arquivo a ser exibido.
   */
  noneFilesMessage: _propTypes2.default.node,

  /**
   * Não dever ser usado, a não ser que seja necessário fazer maiores personalizações. Neste
   * caso consulte a documentação do https://github.com/felixrieseberg/React-Dropzone-Component.
   */
  config: _propTypes2.default.object,
  /**
   * Não dever ser usado, a não ser que seja necessário fazer maiores personalizações. Neste
   * caso consulte a documentação do https://github.com/felixrieseberg/React-Dropzone-Component.
   */
  eventHandlers: _propTypes2.default.object,
  /**
   * Não dever ser usado, a não ser que seja necessário fazer maiores personalizações. Neste
   * caso consulte a documentação do https://github.com/felixrieseberg/React-Dropzone-Component.
   */
  djsConfig: _propTypes2.default.object
};

SimpleReactDropzone.defaultProps = {
  imediateRemove: true,
  onChange: function onChange() {}
};