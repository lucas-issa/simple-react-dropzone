import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { SimpleReactDropzone } from '../lib/ui/SimpleReactDropzone'; //'simple-react-dropzone';
import {defaultIcons} from '../lib/ui/DefaultIcons';

const uploadIcon = defaultIcons.react.uploadIcon;

const Counter = props => (
  <div style={{
    marginTop: 30,
  }}>
    <div>
      {props.counter} seconds since page load.
    </div>
    <div style={{
      color: 'gray',
    }}>
      An React update (setState) in the entire page will happen every 5 seconds.
      It will not be apparent.
    </div>
  </div>
);

const Separator = props => (
  <div>
    <br/>
    <br/>
    <h3 style={{
      marginBottom: 0,
    }}>
      {props.title}
    </h3>
    <div style={{
      marginBottom: 10,
      color: 'gray',
      whiteSpace: 'pre-line',
    }}>
      {props.description}
    </div>
  </div>
);

let fakeFileIdCounter = 0;
function getNewFakeFileId() {
  return ++fakeFileIdCounter;
}

class MySimpleReactDropzone extends React.Component {

  componentDidMount() {
    let dropzone = this.mySimpleReactDropzone.myDropzone;

    // Now fake the file upload, since GitHub does not handle file uploads
    // and returns a 404

    let minSteps = 6,
      maxSteps = 60,
      timeBetweenSteps = 100,
      bytesPerStep = 100000;

    let totalSteps;

    dropzone.uploadFiles = function(files) {

      let self = this;

      for (let i = 0; i < files.length; i++) {

        let file = files[i];
        totalSteps = Math.round(Math.min(maxSteps, Math.max(minSteps, file.size / bytesPerStep)));

        console.info('Fake upload started for file: ' + file.name + '...');

        for (let step = 0; step < totalSteps; step++) {
          var duration = timeBetweenSteps * (step + 1);
          setTimeout(function(file, totalSteps, step) {
            return function() {
              file.upload = {
                progress: 100 * (step + 1) / totalSteps,
                total: file.size,
                bytesSent: (step + 1) * file.size / totalSteps
              };

              self.emit('uploadprogress', file, file.upload.progress, file.upload.bytesSent);
              if (file.upload.progress === 100) {
                file.status = 'success'; // Dropzone.SUCCESS;
                file.id = getNewFakeFileId();
                self.emit("success", file, 'success', null);
                self.emit("complete", file);
                self.processQueue();
                console.info('Fake upload ended for file: ' + file.name);
              }
            };
          }(file, totalSteps, step), duration);
        }
      }
    }

  }

  reset() {
    this.mySimpleReactDropzone.reset();
  }

  render() {
    return (
      <SimpleReactDropzone
        ref={ref => this.mySimpleReactDropzone = ref}
        deleteUrl={(file, onSuccess, onError) => {
          console.log('Fake server file delete. File name: ', file.fileName);
          onSuccess();
        }}
        downloadUrl={(file) => {
          window.alert('Fake download of the file: ' + file.name);
        }}
        dragAndClickMessage={(
          <div>
            <div>{uploadIcon}</div>
            <div>
              Drap and drop files here or click here.
            </div>
          </div>
        )}
        noneFilesMessage="No uploaded files"
        {...this.props}
      />
    );
  }
}

class Samples extends Component {

  constructor(props) {
    super(props);
    this.state = {
      counter: 0,
      uploadState: {
        newUploadedFiles: [],
        alreadyAssociatedRemovedFiles: [],
        hasPendingUpload: false,
      },
      uploadStateImediate: {
        newUploadedFiles: [],
        alreadyAssociatedRemovedFiles: [],
        hasPendingUpload: false,
      },
      existingFiles: [
        {
          id: -1,
          name: "Filename.txt",
          size: 12345,
          lastModifiedDate: new Date(),
        },
        {
          id: -2,
          name: "Filename 2.pdf",
          size: 123450,
          lastModifiedDate: new Date(),
          hideDeleteAction: true,
        },
      ],
      existingFiles2: [
        {
          id: -3,
          name: "Filename 3.txt",
          size: 1234500,
          lastModifiedDate: new Date(),
        },
        {
          id: -4,
          name: "Filename 4.pdf",
          size: 12345000,
          lastModifiedDate: new Date(),
          // hideDeleteAction: true,
        },
      ],
    };
  }

  componentDidMount() {

    const count = () => {
      const incrementInSeconds = 5;
      const counter = this.state.counter + incrementInSeconds;
      this.setState({
        counter,
        // existingFiles: [
        //   {
        //     name: "Filename " + counter,
        //     size: counter * 1024,
        //   },
        // ],
      });
      // An a update with setState will happen every 5s.
      // This is done to prove that updates can happen without problems.
      setTimeout(count, incrementInSeconds * 1000);
    };

    count();
  }

  render() {
    const url = 'None. Fake methods has being implemented for the demo. So there is no need of a server.';

    return (
      <div>
        <Counter counter={this.state.counter}/>
        <Separator
          title="Delete and association only on save"
          description={
            `imediateRemove={false}
            Will not delete already associated file until the save button is clicked.
            New uploaded file will be listed to be associated when the save button is clicked.`
          }
        />
        <div>
          <MySimpleReactDropzone
            uploadUrl={url}
            ref={ref => this.refSimpleReactDropzone = ref}
            existingFiles={this.state.existingFiles2}
            imediateRemove={false}
            maxFiles={2}
            onChange={e => {
              console.log('*** onChange (delayedRemove)', e);
              this.setState({uploadState: {...e.newState}});
            }}
          />
          { this.renderAddedAndRemovedMessages() }
          { this.renderSaveAndCancel() }
        </div>
        <Separator
          title="Imediate delete"
          description={
            `imediateRemove={true}
            Will delete the file immediately.
            New uploaded file shold be associated on the upload.
            The delete action of the second file was hidden.`
          }
        />
        <div>
          <MySimpleReactDropzone
            uploadUrl={url}
            existingFiles={this.state.existingFiles}
            imediateRemove={true}
            onChange={e => {
              console.log('*** onChange (uploadStateImediate)', e);
              this.setState({uploadStateImediate: {...e.newState}});
            }}
          />
        </div>
        <Separator
          title="Read only"
          description={
            `Only download will be available.`
          }
        />
        <div>
          <MySimpleReactDropzone
            uploadUrl={url}
            existingFiles={this.state.existingFiles}
            imediateRemove={false}
            hideDeleteActions={true}
            disableAddActions={true}
          />
        </div>
        <Separator title="Empty read only" />
        <div>
          <MySimpleReactDropzone
            uploadUrl={url}
            hideDeleteActions={true}
            disableAddActions={true}
          />
        </div>
        <Counter counter={this.state.counter}/>

      </div>
    );
  }

  renderAddedAndRemovedMessages = () => {
    return (
      <div>
        {this.state.uploadState.newUploadedFiles.length > 0 &&
        <div>
          Added files ({this.state.uploadState.newUploadedFiles.length}):
          <div style={{marginLeft: 15}}>
            {this.state.uploadState.newUploadedFiles.map((file, i) => <div key={i}>fileId: {file}</div>)}
          </div>
        </div>
        }
        {this.state.uploadState.alreadyAssociatedRemovedFiles.length > 0 &&
        <div>
          Removed files ({this.state.uploadState.alreadyAssociatedRemovedFiles.length}):
          <div style={{marginLeft: 15}}>
            {this.state.uploadState.alreadyAssociatedRemovedFiles.map((file, i) => <div key={i}>fileId: {file}</div>)}
          </div>
        </div>
        }
      </div>
    );
  };

  renderSaveAndCancel = () => {
    return (
      <div
        style={{
          textAlign: 'right',
        }}
      >
        <RaisedButton
          label="Save"
          disabled={this.state.uploadState.hasPendingUpload}
          onTouchTap={e => {

            let mesg = '';
            let uploadState = this.state.uploadState;
            if (uploadState.alreadyAssociatedRemovedFiles && uploadState.alreadyAssociatedRemovedFiles.length > 0) {
              mesg += `File ids that should be deleted from the server:\n  ${uploadState.alreadyAssociatedRemovedFiles.join(', ')}\n`;
            }
            if (uploadState.newUploadedFiles && uploadState.newUploadedFiles.length > 0) {
              mesg += `File ids that should be associated to some entity on the server:\n  ${uploadState.newUploadedFiles.join(', ')}\n`;
            }
            if (mesg === '') {
              mesg = 'Nothing to be done.';
            } else {
              mesg += `On the real implementation the component should be remounted with the new correct files. \n` +
                `This is not done in this demo because the upload is fake.`;
            }
            window.alert(mesg);
            // this.setState({
            //   newUploadedFiles: [...this.refSimpleReactDropzone.newUploadedFiles],
            //   alreadyAssociatedRemovedFiles: [...this.refSimpleReactDropzone.alreadyAssociatedRemovedFiles],
            // });
          }}
        />
        <RaisedButton label="Cancel"
                      onTouchTap={e => {
                        this.refSimpleReactDropzone.reset();

                        // Test update with new file lists.
                        this.setState({
                          existingFiles: [
                            ...this.state.existingFiles,
                          ],
                          existingFiles2: [
                            ...this.state.existingFiles2,
                          ],
                        });
                      }}
        />
      </div>
    );
  };
}

export default Samples;
