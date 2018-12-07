import React, { Component } from 'react';
import './App.css';
import Form from "./Form";
import AppBar from '@material-ui/core/AppBar';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="AppBar">
        <AppBar>
          Domain's Ads
        </AppBar>
        </div>
      <br/>
        <Form />
      </div>
    );
  }
}

export default App;
