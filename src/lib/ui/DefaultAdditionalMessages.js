import React from 'react';
import {defaultIcons} from './DefaultIcons';

const uploadIcon = defaultIcons.react.uploadIcon;

export const reactDragAndClickDefaultMessage = (
  <div>
    <div>{uploadIcon}</div>
    <div>
      Arraste arquivos aqui para anexa-los ou click aqui.
    </div>
  </div>
);
