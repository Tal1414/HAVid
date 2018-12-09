import React, {Component} from 'react';
import './App.css';
import AppContent from "./AppContent";
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
                <div>
                <AppContent/>
                </div>
            </div>
        );
    }
}

export default App;
