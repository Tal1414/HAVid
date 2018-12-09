import React, {Component} from 'react';
import axios from 'axios';
import DomainsTable from './DomainsTable';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import './AppContent.css';

class AppContent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: '',
            sortingOptions: 'Descending',
            list: '',
            lastDomain: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleRadio = this.handleRadio.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleRadio(event) {
        this.setState({sortingOptions: event.target.value});
    }

    handleSubmit(event) {
        this.setState({list: 'loading'});
        let domain = 'http://localhost:3001/getinfo/' + this.state.value + '/' + this.state.sortingOptions;
        axios.get(domain)
            .then(response => {
                this.setState({list: response.data, lastDomain: this.state.value});
            })
            .catch(error => {
                if (error.response) {
                    this.setState({list: error.response.status, lastDomain: this.state.value});
                } else {
                    this.setState({list: error, lastDomain: this.state.value});
                }
            });
        event.preventDefault();
    }

    render() {
        return (
            <div className="Form">
                <div className="Form-header">
                    <p>
                        Please enter a domain to get Ads.txt information:
                    </p>
                    <form onSubmit={this.handleSubmit}>
                        <div className='inputText'>
                        <label>
                            <Input value={this.state.value} onChange={this.handleChange}/>
                        </label>
                        </div>
                        Sort by: (number of appearances)
                        <div className='radioBtns'>
                        <label>
                            <Radio color='primary' value="Descending" checked={this.state.sortingOptions === 'Descending'}
                                   onChange={this.handleRadio}/>
                            Descending
                        </label>
                        <label>
                            <Radio color='primary' value="Ascending" checked={this.state.sortingOptions === 'Ascending'}
                                   onChange={this.handleRadio}/>
                            Ascending
                        </label>
                        </div>
                        <Button type="submit" variant="contained"><b>Go!</b></Button>
                    </form>
                    <div className='table'>
                        <hr/>
                        <DomainsTable toTable={this.state.list} domainName={this.state.lastDomain}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default AppContent;
