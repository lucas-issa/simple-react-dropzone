import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import { SimpleReactDropzone } from './SimpleReactDropzone';

const errorStyle = {
  color: 'rgb(244, 67, 54)',
  fontSize: 12,
  paddingTop: 2,
};

const countFiles = (value, existingFiles) => {
  const { newUploadedFiles, alreadyAssociatedRemovedFiles } = value || {};

  const existingFilesCount = existingFiles ? existingFiles.length : 0;
  const newUploadedFilesCount = newUploadedFiles ? newUploadedFiles.length : 0;
  const alreadyAssociatedRemovedFilesCount = (
    alreadyAssociatedRemovedFiles ? alreadyAssociatedRemovedFiles.length : 0
  );

  const filesCount = (
    (existingFilesCount - alreadyAssociatedRemovedFilesCount) + newUploadedFilesCount
  );

  return filesCount;
};

const validadeRequired = (value, existingFiles) => {
  const filesCount = countFiles(value, existingFiles);

  return (filesCount > 0 ? undefined : 'Campo obrigatório');
};

class SimpleReactDropzoneForReduxForm extends React.Component {

  state = {
    hasPendingUpload: false,
  };

  onChange = ({ newState }) => {
    const { input: { onChange, onBlur } } = this.props;
    const { hasPendingUpload, ...otherNewStates } = newState;
    const newHasPendingUpload = !hasPendingUpload ? undefined : hasPendingUpload;

    if (this.state.hasPendingUpload !== hasPendingUpload) {
      this.setState({ hasPendingUpload });
    }
    const newValue = {
      ...otherNewStates,

      // se for falso, deve ser undefined para permitir
      // desabilitar o salvar quando o formulario voltar para o valor inicial.
      hasPendingUpload: newHasPendingUpload,
    };
    onBlur();
    onChange(newValue);
  };

  render() {
    const { hasPendingUpload } = this.state;
    const { meta: { touched, invalid, error } } = this.props;

    return (
      <div>
        <SimpleReactDropzone
          {...this.props}
          onChange={this.onChange}
        />
        {touched && !hasPendingUpload && invalid &&
          <div style={errorStyle}>{error}</div>
        }
      </div>
    );
  }

}

export const ReduxFormFieldSimpleReactDropzone = props => (
  <Field
    {...props}
    component={SimpleReactDropzoneForReduxForm}
    validate={value => (
      (props.required && validadeRequired(value, props.existingFiles)) ||
        (props.validate && props.validate(value, countFiles(value, props.existingFiles), props.existingFiles))
    )}
  />
);


ReduxFormFieldSimpleReactDropzone.propTypes = {
  name: PropTypes.string.isRequired,
  required: PropTypes.bool,
  uploadUrl: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  uploadParams: PropTypes.object,
  existingFiles: PropTypes.array,
  imediateRemove: PropTypes.bool,
  maxFilesize: PropTypes.number,
  maxFiles: PropTypes.number,
};
