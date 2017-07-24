
## Demo

https://lucas-issa.github.io/simple-react-dropzone/

The **demo source code** is located at **`src/samples`**. 

To run this demo application and play with it run:
```bash
  yarn && yarn run start-sample
```

## How to use

### Instalation

    yarn add simple-react-dropzone


#### With redux-form

```javascript

import 'simple-react-dropzone/ui/css/filepicker.css'; // You can copy to your project and change.
import 'simple-react-dropzone/ui/css/dropzone.css';   // You can copy to your project and change.
import { ReduxFormFieldSimpleReactDropzone } from 'simple-react-dropzone';

// Create your own component with some default configurations.
const MySimpleReactDropzone = props => (
  <ReduxFormFieldSimpleReactDropzone
    // By default will be used to upload (POST method), download (GET method) and delete (DELETE method).
    uploadUrl={'your-upload-url'}
    imediateRemove={false} // Choose the mode you want to use. Look at props documentation.
    maxFilesize={20} // MB
    {...props} 
  />
);


// Component use:
const UploadAndDownloadPanel = props => (
  <MySimpleReactDropzone
    name="files"
    maxFiles={10}
    // You can show some files already uploaded.
    // Each file should have the follow props: {name, id, size, lastModifiedDate}.
    existingFiles={[]} 
  />
);

// ...

// With imediateRemove=false files are uploaded automatically to the server without association 
// to any system entity. The association should be done when the form is saved. 
// The form will have a field (see prop name) with two arrays. 
// One with the files ids which were added and other with the removed ones. 
// The added ones should be asssociated to the desired entity. 
// The removed ones should be unassociated and deleted.

// The removed files which was not 'existingFiles' will be delete automatically from the server
// and nothing else needs to be done with those files.

// The form field will also have a hasPendingUpload property.
// With this property you can disable save command until all uploads are finished.


```

#### Without redux-form

```javascript

import 'simple-react-dropzone/ui/css/filepicker.css'; // You can copy to your project and change.
import 'simple-react-dropzone/ui/css/dropzone.css';   // You can copy to your project and change.
import { SimpleReactDropzone } from 'simple-react-dropzone';

```

`SimpleReactDropzone` is different from `ReduxFormFieldSimpleReactDropzone` only by not having 
`name` property and the property `onChange` should be used to
know which files were added, removed and if has pending upload. All other properties are the same.



### Properties documentation
 
 Look at the `SimpleReactDropzone.propTypes` code documentation in `src/lib/ui/SimpleReactDropzone.js`. 
 
