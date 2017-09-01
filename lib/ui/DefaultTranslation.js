"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var defaultTranslation = exports.defaultTranslation = {
  dictDefaultMessage: '',
  // dictDefaultMessage: renderToStaticMarkup(reactDictDefaultMessage),
  dictFallbackMessage: "Your browser does not support drag'n'drop file uploads.",
  dictFallbackText: "Please use the fallback form below to upload your files like in the olden days.",
  dictFileTooBig: "O arquivo é muito grande ({{filesize}}MiB). Tamanho máximo pemitido:" + " {{maxFilesize}}MiB.",
  dictInvalidFileType: "Não pode ser enviado arquivo deste tipo.",
  dictResponseError: "Servidor respondeu com o código de erro: {{statusCode}}",
  dictCancelUpload: "Cancelar envio",
  dictCancelUploadConfirmation: "Tem certeza que deseja cancelar este envio?",
  dictRemoveFile: "Excluir arquivo",
  dictRemoveFileConfirmation: null,
  dictMaxFilesExceeded: "Não podem ser enviado mais arquivos.",
  dictFileSizeUnits: { tb: "TB", gb: "GB", mb: "MB", kb: "KB", b: "b" }
};