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
            sortingOptions: 'vDescending',
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
        let domain = 'http://localhost:3001/getinfo/' + this.state.value;
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
                        Sort by:
                        <div className='radioBtns'>
                        <label>
                            <Radio color='primary' value="vDescending" checked={this.state.sortingOptions === 'vDescending'}
                                   onChange={this.handleRadio}/>
                            Descending(value)
                        </label>
                        <label>
                            <Radio color='primary' value="vAscending" checked={this.state.sortingOptions === 'vAscending'}
                                   onChange={this.handleRadio}/>
                            Ascending(value)
                        </label>
                            <label>
                                <Radio color='primary' value="dDescending" checked={this.state.sortingOptions === 'dDescending'}
                                       onChange={this.handleRadio}/>
                                Descending(domain)
                            </label>
                            <label>
                                <Radio color='primary' value="dAscending" checked={this.state.sortingOptions === 'dAscending'}
                                       onChange={this.handleRadio}/>
                                Ascending(domain)
                            </label>
                        </div>
                        <Button type="submit" variant="contained"><b>Go!</b></Button>
                    </form>
                    <div className='table'>
                        <hr/>
                        <DomainsTable toTable={this.state.list} domainName={this.state.lastDomain} sortBy={this.state.sortingOptions}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default AppContent;
