import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

import TextField from 'material-ui/TextField';
import Samples from './Samples';
import '../lib/ui/css/filepicker.css';
import '../lib/ui/css/dropzone.css';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();

class AppSamples extends Component {

  state = {
    text: '',
  };

  render() {
    return (
      <div>
        <MuiThemeProvider>
          <div className="App">
            <TextField
              floatingLabelText="Controlled text field to test component updates"
              value={this.state.text}
              onChange={(e, text) => {
                this.setState({
                  text,
                });
              }}
              fullWidth={true}
            />
            <Samples />
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default AppSamples;
