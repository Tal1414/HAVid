import React, { Component } from 'react';
import axios from 'axios';
import WithStyles from './WithStyles';

class Form extends Component {

    constructor(props) {
        super(props);
        this.state = {value: '',
        list: ''};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        this.setState({value: event.target.value});
    }

    handleSubmit(event) {
        let domain = 'http://localhost:3001/getads/' + this.state.value;
        axios.get(domain)
            .then(response => {
                this.setState({list: response.data});
                console.log(this.state.list);
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
                        <input type="submit" value="Submit" />
                    </form>
                    <WithStyles toTable = {this.state.list} />
                </header>
            </div>
        );
    }
}

export default Form;
