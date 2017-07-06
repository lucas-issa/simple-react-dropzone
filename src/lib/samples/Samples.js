import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { SimpleReactDropzone } from '../ui/SimpleReactDropzone'; //'simple-react-dropzone';

const Counter = props => (<span>{props.counter} segundos</span>);

const Separator = props => (<div><br/><hr/>{props.title}</div>);

const url = 'http://chicobento.synergia.dcc.ufmg.br:8082/';

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
          name: "Filename",
          size: 12345,
          lastModifiedDate: new Date(),
        },
        {
          id: -2,
          name: "Filename 2",
          size: 123450,
          lastModifiedDate: new Date(),
          hideDeleteAction: true,
        },
      ],
      existingFiles2: [
        {
          id: -3,
          name: "Filename 3",
          size: 1234500,
          lastModifiedDate: new Date(),
        },
        {
          id: -4,
          name: "Filename 4",
          size: 12345000,
          lastModifiedDate: new Date(),
          // hideDeleteAction: true,
        },
      ],
    };
  }

  componentDidMount() {

    const count = () => {
      const incrementEmSegundos = 5;
      const counter = this.state.counter + incrementEmSegundos;
      this.setState({
        counter,
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

  render() {
    return (
      <div>
        <Counter counter={this.state.counter}/>
        <Separator title="Exclusão ao salvar:"/>
        <div>
          <SimpleReactDropzone
            uploadUrl={url}
            ref={ref => this.refSimpleReactDropzone = ref}
            existingFiles={this.state.existingFiles2}
            imediateRemove={false}
            onChange={e => {
              console.log('*** onChange (delayedRemove)', e);
              this.setState({uploadState: {...e.newState}});
            }}
          />
          {this.state.uploadState.newUploadedFiles.length > 0 &&
            <div>
              Arquivos adicionados ({this.state.uploadState.newUploadedFiles.length}):
              {this.state.uploadState.newUploadedFiles.map((file, i) => <div key={i}>{file.name}</div>)}
            </div>
          }
          {this.state.uploadState.alreadyAssociatedRemovedFiles.length > 0 &&
          <div>
            Arquivos removidos ({this.state.uploadState.alreadyAssociatedRemovedFiles.length}):
            {this.state.uploadState.alreadyAssociatedRemovedFiles.map((file, i) => <div key={i}>{file.name}</div>)}
          </div>
          }
          <div
            style={{
              textAlign: 'right',
            }}
          >
            <RaisedButton
              label="Salvar"
              disabled={this.state.uploadState.hasPendingUpload}
              onTouchTap={e => {
                // this.setState({
                //   newUploadedFiles: [...this.refSimpleReactDropzone.newUploadedFiles],
                //   alreadyAssociatedRemovedFiles: [...this.refSimpleReactDropzone.alreadyAssociatedRemovedFiles],
                // });
              }}
            />
            <RaisedButton label="Cancelar"
                          onTouchTap={e => {
                            this.refSimpleReactDropzone.reset();
                          }}
            />
          </div>
        </div>
        <Separator title="Exclusão imediata:"/>
        <div>
          <SimpleReactDropzone
            uploadUrl={url}
            existingFiles={this.state.existingFiles}
            imediateRemove={true}
            onChange={e => {
              console.log('*** onChange (uploadStateImediate)', e);
              this.setState({uploadStateImediate: {...e.newState}});
            }}
          />
        </div>
        <Separator title="Somente leitura:" />
        <div>
          <SimpleReactDropzone
            uploadUrl={url}
            existingFiles={this.state.existingFiles}
            imediateRemove={false}
            hideDeleteActions={true}
            disableAddActions={true}
          />
        </div>
        <Separator title="Somente leitura vazio:" />
        <div>
          <SimpleReactDropzone
            uploadUrl={url}
            hideDeleteActions={true}
            disableAddActions={true}
          />
        </div>
        <Counter counter={this.state.counter}/>

      </div>
    );
  }
}

export default Samples;
