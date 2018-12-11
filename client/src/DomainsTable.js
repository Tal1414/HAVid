import React from 'react';
import PropTypes from 'prop-types';
import {withStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import Downloader from "./Downloader";

const styles = theme => ({
    root: {
        width: '70%',
        margin: 'auto auto',
        marginTop: theme.spacing.unit * 3,
        overflowX: 'auto',
    },
    table: {
        minWidth: '600',
    },

});

let id = 0;

function createData(domain, value) {
    id += 1;
    return {id, domain, value};
}

function sort(data, sortBy) {
    let new_arr = [].concat(data);
    if (sortBy === 'vDescending') {
        new_arr.sort(sortFunctionvD);
    } else if(sortBy === 'vAscending'){
        new_arr.sort(sortFunctionvA);
    } else if (sortBy === 'dDescending'){
        new_arr.sort(sortFunctiondD);
    } else {
        new_arr.sort(sortFunctiondA);
    }

    return new_arr;
}

//sort by value, descending order
function sortFunctionvD(a, b) {
    if (a[1] === b[1]) {
        return 0;
    } else {
        return (a[1] > b[1]) ? -1 : 1;
    }
}

//sort by value, ascending order
function sortFunctionvA(a, b) {
    if (a[1] === b[1]) {
        return 0;
    } else {
        return (a[1] < b[1]) ? -1 : 1;
    }
}

//sort by value, descending order
function sortFunctiondD(a, b) {
    if (a[0] === b[0]) {
        return 0;
    } else {
        return (a[0] > b[0]) ? -1 : 1;
    }
}

//sort by value, ascending order
function sortFunctiondA(a, b) {
    if (a[0] === b[0]) {
        return 0;
    } else {
        return (a[0] < b[0]) ? -1 : 1;
    }
}



function SimpleTable(props) {
    const {classes} = props;
    const name = props.domainName;
    const data = props.toTable;
    const sortBy = props.sortBy;
    const rows = [];
    const new_data = sort(data, sortBy);

    if (new_data) {
        for (let i = 0; i < new_data.length; i++) {
            rows.push(createData(new_data[i][0], new_data[i][1]));
        }
    }
    if (data !== 404 && data !== 400 && data && data !== 'loading') {
        return (
            <div>
                <Downloader data={data}/>
                <Paper className={classes.root}>
                    <h1> {name} "Ads.txt" Results:</h1>
                    <Table className={classes.table} style={{width: 400, margin: 'auto'}}>
                        <TableHead>
                            <TableRow align={'center'}>
                                <TableCell>Domain</TableCell>
                                <TableCell numeric>Number of appearances</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {rows.map(row => {
                                return (
                                    <TableRow key={row.id} align={'center'}>
                                        <TableCell component="th" scope="row">
                                            {row.domain}
                                        </TableCell>
                                        <TableCell numeric>{row.value}</TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </Paper>
            </div>
        );
    } else if (data === 404) {
        return (
            <div>
                <h1>Error!</h1>
                <h2>please check the domain you entered, it may not have an "ads.txt"</h2>
            </div>
        );
    } else if (data === 400) {
        return (
            <div>
                <h1>Error!</h1>
                <h2>please enter a valid domain</h2>
            </div>
        );
    } else if (data === 'loading') {
        return (
            <div>
                <CircularProgress/>
            </div>
        );
    } else {
        return (
            <h2>Waiting for submit</h2>
        );
    }
}

SimpleTable.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(SimpleTable);
