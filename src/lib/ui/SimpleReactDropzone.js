import React from 'react';
import PropTypes from 'prop-types';
import {defaultIcons} from './DefaultIcons';
import {reactDragAndClickDefaultMessage} from './DefaultAdditionalMessages';
import {defaultTranslation} from './DefaultTranslation';
import {defaultPreviewTemplate} from './DefaultPreviewTemplate';
import DropzoneComponent from 'react-dropzone-component';
// import 'react-dropzone-component/styles/filepicker.css';
// import 'dropzone/dist/dropzone.css';
// import './SimpleReactDropzone.css';
import axios from 'axios';


// TODO geral: Talvez colocar um "processando..." para esperar excluir o arquivo no servidor.


let idCompCounter = 0;

let hasStaticInitialize = false;
function staticInitialization(Dropzone) {
  if (!hasStaticInitialize) {
    Dropzone.confirm = SimpleReactDropzone.confirm;
    hasStaticInitialize = true;
  }
}

const htmlDeleteIcon = defaultIcons.html.deleteIcon;
const htmlDeleteForeverIcon = defaultIcons.html.deleteForeverIcon;

const componentConfig = {
  // iconFiletypes: ['.jpg', '.png', '.gif'],
  // showFiletypeIcon: true,
  // postUrl: 'http://localhost:8080/', // '/uploadHandler',
};
const djsConfig = {
  // url: 'teste',
  // autoProcessQueue: false,
  // addRemoveLinks: true,
  previewTemplate: defaultPreviewTemplate,
  ...defaultTranslation,
};


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
export class SimpleReactDropzone extends React.PureComponent {

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
  static confirm = function(question, accepted, rejected) {

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

  myDropzone;

  /**
   * Necessário para identificar unicamente o componente e conseguir usar expressões
   * para localizar os elementos que devem ser clicaveis.
   */
  idComp;

  newUploadedFiles = [];
  alreadyAssociatedRemovedFiles = [];
  filesToDelete = [];

  /**
   * Needs a internal value because existing files has to be subtracted.
   */
  internalMaxFiles;

  constructor(props) {
    super(props);
    this.idComp = ++idCompCounter;
    this.eventHandlers = {
      init: (myDropzone) => {
        this.dropzoneInit(myDropzone);
      },
    };

    this.calculateAndSetMaxFiles(props);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.existingFiles !== nextProps.existingFiles) {
      this.clearAlreadyAssociatedFiles();
      this.setExistingFiles(nextProps.existingFiles);
      this.calculateAndSetMaxFiles(nextProps);
      this.fireChangeEvent('setExistingFiles', nextProps.existingFiles);
    }

    if (this.props.disableAddActions !== nextProps.disableAddActions) {
      this.setDisableAddActions(nextProps);
    }
  }

  calculateAndSetMaxFiles = (props) => {
    if (props.maxFiles) {
      let existingFileCount = props.existingFiles ? props.existingFiles.length : 0;
      let removedExistingFilesCount =
        this.alreadyAssociatedRemovedFiles ? this.alreadyAssociatedRemovedFiles.length : 0;
      this.internalMaxFiles = props.maxFiles - (existingFileCount - removedExistingFilesCount);
      if (this.myDropzone) {
        this.myDropzone.options.maxFiles = this.internalMaxFiles;
      }
    }
  };

  dropzoneInit = (myDropzone) => {

    staticInitialization(myDropzone.constructor);

    // console.log('dropzone.init: ', myDropzone);

    this.myDropzone = myDropzone;
    setTimeout(() => {
      this.setExistingFiles(this.props.existingFiles);
    });

    this.setDisableAddActions(this.props);

    myDropzone.on('addedfile', (file) => {

      // console.log('addedfile: ', file);

      if (typeof file.lastModifiedDate === 'string') {
        file.lastModifiedDate = new Date(file.lastModifiedDate);
      }

      this.setDownloadLink(file);

      if (this.props.hideDeleteActions || file.hideDeleteAction) {
        let deleteActionElement = file.previewElement.querySelector("div[data-dz-remove]");
        if (deleteActionElement) {
          deleteActionElement.parentNode.removeChild(deleteActionElement);
        }
      } else {

        let deleteActionElement = file.previewElement.querySelector("div[data-dz-remove]");
        if (deleteActionElement) {
          if (this.props.imediateRemove) {
            deleteActionElement.innerHTML += (this.props.htmlDeleteForeverIcon || htmlDeleteForeverIcon);
          } else {
            deleteActionElement.innerHTML += (this.props.htmlDeleteIcon || htmlDeleteIcon);
          }
        }
      }

      if (file.lastModifiedDate) {
        let dateElement = file.previewElement.querySelector("[data-dz-date]");
        if (dateElement) {
          dateElement.innerHTML = file.lastModifiedDate.toLocaleString();
        }
      }

      this.calculateAndSetMaxFiles(this.props);
      this.fireChangeEvent('addedfile', file);

    });

    myDropzone.on('removedfile', (file) => {

      let originalEventName = 'removedfile';
      let internalEventName = originalEventName;
      function defineInternalEventName(state) {
        if (state) {
          internalEventName = `${originalEventName}.${state}`;
        } else {
          internalEventName = originalEventName;
        }
      }

      const removeFileFromServer = (file) => {

        let removeFromServer = false;

        if (file.status !== 'canceled') {
          if (this.props.imediateRemove && file.errorOnDeleteFromServer) {
            removeFromServer = true;
          } else if (file.status !== 'error') {
            removeFromServer = true;
          }
        }

        if (removeFromServer) {
          defineInternalEventName('removeFromServer');
          this.deleteFileFromServer(file);
        }
      };

      if (this.props.imediateRemove ) {
        removeFileFromServer(file);
      } else {
        if (!file.alreadyAssociated) {
          removeFileFromServer(file);

          let indexToRemove = this.newUploadedFiles.indexOf(file);
          if (indexToRemove > -1) {
            this.newUploadedFiles.splice(indexToRemove, 1);
          }
        } else {
          this.alreadyAssociatedRemovedFiles.push(file);
        }
      }
      // console.log('removedfile: ', file);
      if (file.status === 'canceled') {
        defineInternalEventName(file.status);
      }
      this.calculateAndSetMaxFiles(this.props);
      this.fireChangeEvent(internalEventName, file);
    });

    myDropzone.on('success', (file, response) => {

      if (file.xhr.status === 200) {
        let jsonResponse = response;// JSON.parse(response);
        file.id = jsonResponse.id;

        this.setDownloadLink(file);
      }

      if (!this.props.imediateRemove) {
        this.newUploadedFiles.push(file);
      }

      // console.log('success, file: ', file, ', response: ', response);

      this.fireChangeEvent('success', file);

    });

    // myDropzone.on('error', (file, errorMessage) => {
    //   // console.log('error, file: ', file, ', errorMessage: ', errorMessage);
    //   this.fireChangeEvent('error', file);
    // });
    //

  };

  deleteFileFromServer = (file) => {
    let deleteUrl = this.props.deleteUrl ? this.props.deleteUrl : this.props.uploadUrl;

    if (deleteUrl) {

      const onError = (error) => {
        file.errorOnDeleteFromServer = true;
        this.myDropzone.emit('addedfile', file);
        this.myDropzone.emit("error", file, error);
        this.myDropzone.emit("complete", file);
      };

      const onSuccess = () => {
        let i = this.filesToDelete.indexOf(file);
        if (i !== -1) {
          this.filesToDelete.splice(i, 1);
        }
        this.fireChangeEvent('removefileOnServer.finish', file);
      };

      let params = {
        ...this.props.uploadParams,
        fileId: file.id,
        fileName: file.name,
      };

      if (typeof deleteUrl === 'function') {
        deleteUrl(params, onSuccess, onError);
      } else {
        let i = this.filesToDelete.indexOf(file);
        if (i === -1) {
          this.filesToDelete.push(file);
        }
        this.fireChangeEvent('removefileOnServer.start', file);
        axios.delete(deleteUrl, {params}).then(onSuccess, onError);
      }
    }
  };

  clearAlreadyAssociatedFiles = () => {
    // for (let file of this.props.existingFiles) {
    //   this.myDropzone.emit("removeFile", file);
    //   // this.myDropzone.removeFile(file);
    // }
    // this.myDropzone.emit("removeAllFiles");

    if (this.myDropzone.files) {
      for (let file of this.myDropzone.files) {
        if (file.alreadyAssociated) {
          this.myDropzone.removeFile(file);
        }
      }
    }

    // this.newUploadedFiles.splice(0,this.newUploadedFiles.length);
    // this.alreadyAssociatedRemovedFiles.splice(0,this.alreadyAssociatedRemovedFiles.length);

    // this.myDropzone.removeAllFiles();
    // this.myDropzone.removeAllFiles(true);
  };

  setExistingFiles = (existingFiles) => {
    if (existingFiles) {
      this.isChangingFiles = true;

      existingFiles = existingFiles.map(existingFile => ({
        ...existingFile,
        alreadyAssociated: true,
        type: '',
      }));
      for (let existingFile of existingFiles) {
        // this.myDropzone.addFile(existingFile);
        this.myDropzone.emit("addedfile", existingFile);

        // And optionally show the thumbnail of the file:
        //     myDropzone.emit("thumbnail", mockFile, "/image/url");
        // Or if the file on your server is not yet in the right
        // size, you can let Dropzone download and resize it
        // callback and crossOrigin are optional.
        // myDropzone.createThumbnailFromUrl(file, imageUrl, callback, crossOrigin);

        // Make sure that there is no progress bar, etc...
        this.myDropzone.emit("complete", existingFile);
      }

      delete this.isChangingFiles;
    }
  };

  setDownloadLink = (file) => {

    let downloadUrl = this.props.downloadUrl ? this.props.downloadUrl : this.props.uploadUrl;

    let linkElementContainer = file.previewElement.querySelector("div.dz-filename");
    let linkElement = linkElementContainer.querySelector("a.downloadLink");
    if (file.id) {
      linkElement.href = `${downloadUrl}?fileId=${file.id}&fileName=${file.name}`;
    }
  };

  setDisableAddActions = (props) => {
    if (this.props.disableAddActions) {
      this.myDropzone.removeEventListeners();
    } else {
      this.myDropzone.setupEventListeners();
    }
  };



  reset = () => {
    this.isChangingFiles = true;

    if (this.myDropzone.files) {
      for (let file of this.myDropzone.files) {
        if (!file.alreadyAssociated) {
          file.status = 'canceled'; // Remove sem remover do servidor
          this.myDropzone.removeFile(file);
        }
      }
    }
    this.newUploadedFiles.splice(0,this.newUploadedFiles.length);

    if (this.alreadyAssociatedRemovedFiles) {
      for (let file of this.alreadyAssociatedRemovedFiles) {
        this.myDropzone.emit("addedfile", file);
        this.myDropzone.emit("complete", file);
      }
    }
    this.alreadyAssociatedRemovedFiles.splice(0,this.alreadyAssociatedRemovedFiles.length);


    if (this.filesToDelete) {
      for (let file of this.filesToDelete) {
        console.log('reset, cancel: ', file);
        file.status = 'canceled'; // Remove sem remover do servidor
        this.myDropzone.emit("removedfile", file);
      }
    }
    this.filesToDelete.splice(0,this.filesToDelete.length);


    delete this.isChangingFiles;

    this.fireChangeEvent('reset', this.props.existingFiles);

  };

  fireChangeEvent = (event, target) => {
    if (!this.isChangingFiles) {

      // let info = {
      //   // getAcceptedFiles: this.myDropzone.getAcceptedFiles().length,
      //   getUploadingFiles: this.myDropzone.getUploadingFiles().length,
      //   getQueuedFiles: this.myDropzone.getQueuedFiles().length,
      //   getRejectedFiles: this.myDropzone.getRejectedFiles().length,
      //   filesToDelete: this.filesToDelete.length,
      //   files: this.myDropzone.files.length,
      // };
      // console.log('info: ', info);

      function toIdList(fileList) {
        return fileList && fileList.map(file => file.id);
      }

      this.props.onChange({
        event,
        target,
        newState: {
          alreadyAssociatedRemovedFiles: toIdList(this.alreadyAssociatedRemovedFiles),
          newUploadedFiles: toIdList(this.newUploadedFiles),
          hasPendingUpload: (
            this.myDropzone.getUploadingFiles().length > 0 ||
            this.myDropzone.getQueuedFiles().length > 0 ||
            this.myDropzone.getRejectedFiles().length > 0 ||
            this.filesToDelete.length > 0
          ),
          // info,
        },
      });
    }
  };

  render() {


    let localConfig = {
      ...componentConfig,
      ...this.props.config,
      postUrl: this.props.uploadUrl,
    };

    let localEventHandlers = {
      ...this.eventHandlers,
      ...this.props.eventHandlers,
    };

    let customContainerId = `dz-container-${this.idComp}`;
    let customMesgId = `dz-custom-mesg-${this.idComp}`;
    let clickable = [
      `#${customContainerId}>.dropzone`,
      `#${customMesgId}`,
    ];
    // console.log(clickable);

    let localDjsConfig = {
      // url: this.props.uploadUrl,
      params: this.props.uploadParams,
      // Necessário para ser possível clicar na mensagem e selecionar o arquivo.
      clickable,
      ...djsConfig,
      ...this.props.djsConfig,
      maxFiles: this.internalMaxFiles,
      maxFilesize: this.props.maxFilesize,
    };

    let defaultMessage = (
      <div
        id={`${customMesgId}`}
        style={{paddingTop: 10}}
      >
        {this.props.dragAndClickMessage || reactDragAndClickDefaultMessage}
      </div>
    );

    if (this.props.disableAddActions) {
      localDjsConfig.clickable = false;
      localDjsConfig.dictDefaultMessage = '';
      if (!this.props.existingFiles || this.props.existingFiles.length === 0) {
        defaultMessage = (<div style={{paddingTop: 35}}>Nenhum arquivo enviado</div>);
      } else {
        defaultMessage = '';
      }
    }

    if (this.props.imediateRemove) {
      localDjsConfig.dictRemoveFileConfirmation = 'Tem certeza que deseja remover este arquivo?';
    }

    let readOnlyClassName;
    if (this.props.disableAddActions && this.props.hideDeleteActions) {
      readOnlyClassName = 'srdz-readOnly';
    }

    // console.log('localDjsConfig: ', localDjsConfig);

    return (
      <span
        id={customContainerId}
        className={readOnlyClassName}
      >
        <DropzoneComponent
          config={localConfig}
          eventHandlers={localEventHandlers}
          djsConfig={localDjsConfig}
        >
          {defaultMessage}
        </DropzoneComponent>
      </span>
    );
  }
}

SimpleReactDropzone.propTypes = {

  /**
   * URL to send the file. Will use POST method.
   */
  uploadUrl: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  /**
   * Params to send together with the file.
   */
  uploadParams: PropTypes.object,

  /**
   * Default: uploadUrl, but will use GET method and will add fileId parameter.
   */
  downloadUrl: PropTypes.string,

  /**
   * Default: uploadUrl, but will use DELETE method and will add fileId parameter.
   */
  deleteUrl: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),

  /**
   * Um array de arquivos que devem ser exibidos inicialmente no componente.
   *
   */
  existingFiles: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    lastModifiedDate: PropTypes.string.isRequired,
    size: PropTypes.number,
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
  imediateRemove: PropTypes.bool,

  /**
   * Esconde os comandos de exclusão de arquivos.
   */
  hideDeleteActions: PropTypes.bool,

  /**
   * Não permite adicionar novos arquivos. Esta propriedade deve ser usada no caso de listar
   * os arquivos existentes sem permitir adicionar novos.
   *
   * Essa propriedade não deve ser usada para limitar a quantidade máxima de arquivos que
   * podem ser enviados. Neste caso use a propriedade maxFiles.
   */
  disableAddActions: PropTypes.bool,

  /**
   * Limita o tamanho máximo (em bytes) que o arquivo a ser enviado pode ter.
   */
  maxFilesize: PropTypes.number,
  /**
   * Limita a quantidade máxima de arquivos que podem ser enviados.
   * Valor padrão: null, ou seja, ilimitado.
   */
  maxFiles: PropTypes.number,

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
  onChange: PropTypes.func,

  /**
   * Altera o icone padrão para remover arquivo (não imediatamente).
   * Deve ser uma string com o HTML que irá exibir o icone.
   */
  htmlDeleteIcon: PropTypes.string,
  /**
   * Altera o icone padrão para remover arquivo (imediatamente).
   * Deve ser uma string com o HTML que irá exibir o icone.
   */
  htmlDeleteForeverIcon: PropTypes.string,

  /**
   * Altera a mensagem padrão exibida pelo componente que orientar o usuário como fazer o upload de
   * arquivo.
   */
  dragAndClickMessage: PropTypes.node,



  /**
   * Não dever ser usado, a não ser que seja necessário fazer maiores personalizações. Neste
   * caso consulte a documentação do https://github.com/felixrieseberg/React-Dropzone-Component.
   */
  config: PropTypes.object,
  /**
   * Não dever ser usado, a não ser que seja necessário fazer maiores personalizações. Neste
   * caso consulte a documentação do https://github.com/felixrieseberg/React-Dropzone-Component.
   */
  eventHandlers: PropTypes.object,
  /**
   * Não dever ser usado, a não ser que seja necessário fazer maiores personalizações. Neste
   * caso consulte a documentação do https://github.com/felixrieseberg/React-Dropzone-Component.
   */
  djsConfig: PropTypes.object,
};

SimpleReactDropzone.defaultProps = {
  imediateRemove: true,
  onChange: () => {},
};
