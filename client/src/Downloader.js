import React from 'react';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';


class Downloader extends React.Component {
    state = {
        anchor: null,
    };



    handleClick = event => {
        this.setState({ anchor: event.currentTarget });
    };

    handleClose = (event) => {
        if (event.target.value === 1 || event.target.value === 2) {
            this.setState({anchor: null});
            //if event.target.value = 1 then export as a JSON file, if not -> as a CSV file
            if (event.target.value === 1) {
                let data = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.props.data));
                this.download(data, 'json');
            } else {
                //convert from JSON to CSV
                let data = "data:text/csv;charset=utf-8,";
                this.props.data.forEach(function (rowArray) {
                    let row = rowArray.join(",");
                    data += row + "\r\n";
                });
                this.download(data, 'csv');
            }
        } else {
            this.setState({anchor: null});
        }
    };

    //download the list the chosen format
     download(data, format) {
        let downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", data);
        downloadAnchorNode.setAttribute("download", "data."+format);
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    render() {
        const { anchor } = this.state;

        return (
            <div>
                <Button
                    aria-owns={anchor ? 'simple-menu' : undefined}
                    aria-haspopup="true"
                    onClick={this.handleClick}
                >
                    Export as
                </Button>
                <Menu
                    id="simple-menu"
                    anchorEl={anchor}
                    open={Boolean(anchor)}
                    onClose={this.handleClose}
                >
                    <MenuItem onClick={this.handleClose} value='1'>JSON</MenuItem>
                    <MenuItem onClick={this.handleClose} value='2'>CSV</MenuItem>
                </Menu>
            </div>
        );
    }
}

export default Downloader;
