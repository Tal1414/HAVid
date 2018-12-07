import React, { Component } from 'react';
import axios from 'axios';
import DomainsTable from './DomainsTable';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import Radio from '@material-ui/core/Radio';
import './Form.css';

class Form extends Component {

    constructor(props) {
        super(props);
        this.state = {value: '',
            sortBy: '1',
            list: '',
            lastDomain: ''};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleRadio = this.handleRadio.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleRadio(event) {
        this.setState({sortBy: event.target.value});
    }

    handleSubmit(event) {
        this.setState( {list: 'loading'});
        let domain = 'http://localhost:3001/getads/' + this.state.value + '/' + this.state.sortBy;
        axios.get(domain)
            .then(response => {
                this.setState({list: response.data, lastDomain: this.state.value});
            })
            .catch(error => {
                this.setState({list: error.response.status, lastDomain: this.state.value});
            });
        event.preventDefault();
    }

    render() {
        return (
            <div className="Form">
                <header className="Form-header">
                    <p>
                        Please enter a domain to get Ads.txt information:
                    </p>
                    <form onSubmit={this.handleSubmit}>
                        <label>
                           <Input value={this.state.value} onChange={this.handleChange} />
                        </label>
                        <br/> <br/>
                        Sort by: (number of appearances)
                        <br/>
                        <label>
                            <Radio color='black' value="1" checked={this.state.sortBy === '1'} onChange={this.handleRadio} />
                            Descending
                        </label>
                        <label>
                            <Radio color='black' value="2" checked={this.state.sortBy === '2'} onChange={this.handleRadio} />
                             Ascending
                        </label>
                        <br/> <br/>
                        <Button type="submit" variant="contained"><b>Go!</b></Button>
                    </form>
                    <br/>
                    <div className='table'>
                        <hr/>
                    <DomainsTable toTable = {this.state.list} domainName = {this.state.lastDomain}/>
                    </div>
                </header>
            </div>
        );
    }
}

export default Form;
