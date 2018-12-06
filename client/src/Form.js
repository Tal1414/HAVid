import React, { Component } from 'react';
import axios from 'axios';
import DomainsTable from './DomainsTable';

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
        let domain = 'http://localhost:3001/getads/' + this.state.value + '/' + this.state.sortBy;
        axios.get(domain)
            .then(response => {
                if (response.data) {
                    this.setState({list: response.data, lastDomain: this.state.value});
                } else {
                    this.setState({list: 404, lastDomain: this.state.value});
                }
            })
            .catch(error => {
                console.log(error);
            });
        event.preventDefault();
    }

    render() {
        return (
            <div className="Form">
                <header className="Form-header">
                    <p>
                        Please enter a domain to get Ads.txt information.
                    </p>
                    <form onSubmit={this.handleSubmit}>
                        <label>
                            Domain:
                            <input type="text" value={this.state.value} onChange={this.handleChange} />
                        </label>
                        <br/> <br/>
                        Sort by: (number of appearances)
                        <br/>
                        <label>
                            <input type="radio" value="1" checked={this.state.sortBy === '1'} onChange={this.handleRadio} />
                            Descending
                        </label>
                        <br/>
                        <label>
                            <input type="radio" value="2" checked={this.state.sortBy === '2'} onChange={this.handleRadio} />
                            Ascending
                        </label>
                        <br/>
                        <input type="submit" value="Submit" />
                    </form>
                    <br/> <br/> <br/>
                    <DomainsTable toTable = {this.state.list} domainName = {this.state.lastDomain}/>
                </header>
            </div>
        );
    }
}

export default Form;
