import Page from 'material-ui-shell/lib/containers/Page'
import React, {useEffect, useState, useCallback} from 'react'
import config from '../config'
import {DataGrid} from '@material-ui/data-grid';
import CircularProgress from '@material-ui/core/CircularProgress'
import axios from 'axios'
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';
import Grid from "@material-ui/core/Grid";
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import Toolbar from '@material-ui/core/Toolbar'
import Alert from '@material-ui/lab/Alert';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import SearchIcon from '@material-ui/icons/Search';

export default function HomePage() {

    const [bankData, setBankData] = useState([])
    const [loading, setLoading] = useState(true);
    const [tableLoading, setTableLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [page, setPage] = useState(1);
    const [options, setOptions] = useState([]);
    const [searchBarOpen, setSearchBarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [message, setMessage] = useState('');
    const [totalCount, setTotalCount] = useState(0);
    const suggestionsLoading = searchBarOpen && options.length === 0;

    const headCells = [
        {
            field: 'favourites',
            headerName: 'Favourite',
            width: 150,
            renderCell: (params) => {
                return (
                    <div>
                        <IconButton color="primary" aria-label="add to favourites" component="span">
                            {checkFavouriteItem(params.row.bankIFSC) ? (<StarIcon/>) : (<StarBorderIcon/>)}
                        </IconButton>
                    </div>
                )
            }
        },
        {field: 'bankIFSC', width: 150, headerName: 'IFSC'},
        {field: 'bankId', type: 'number', width: 150, headerName: 'Bank ID'},
        {field: 'bankBranch', type: 'text', width: 150, headerName: 'Branch'},
        {field: 'bankAddress', width: 250, headerName: 'Address'},
        {field: 'bankCity', type: 'text', width: 160, headerName: 'City'},
        {field: 'bankDistrict', type: 'text', width: 150, headerName: 'District'},
        {field: 'bankState', type: 'text', width: 150, headerName: 'State'},
    ];

    const handleClose = () => {
        setOpen(false);
    }

    const handlePageChange = (params) => {
        if (searchQuery === '') {
            setTableLoading(true);
            fetchApiData();
            setPage(params.page);
        }
    };

    const checkFavouriteItem = (itemID) => {
        const item = localStorage.getItem(itemID);
        if (!item) return false
        else return true
    }

    const markAsFavourite = useCallback((params) => {
        const ifsc = params.row.bankIFSC;
        if (!checkFavouriteItem(ifsc)) {
            setMessage(`${ifsc} successfully added to favourites!`)
            localStorage.setItem(ifsc, ifsc);
            setOpen(true);
        } else {
            setMessage(`${ifsc} removed from favourites!`)
            localStorage.removeItem(ifsc);
            setOpen(true);
        }
    });

    const fetchApiData = useCallback(() => {

        var params = {
            page: page - 1,
            items: 100
        };

        axios.get(`${config.server.branchURL}/`, {params}).then((response) => {

            setTableLoading(false);
            setLoading(false);

            if (response.status === 200) {
                let data = response.data;
                let branches = data.branches;

                setTotalCount(data.totalCount);

                let idData = branches.map(function (el, index) {
                    var obj = Object.assign({}, el);
                    obj.id = index;
                    return obj
                })
                setBankData(idData);
            }
        }, (error) => {

            setTableLoading(false);
            setLoading(false);

            console.log(error);
        })
    });

    const fetchAutoSuggestData = useCallback(() => {

        var params = {
            limit: 10,
            offset: 0,
            q: searchQuery
        };

        axios.get(`${config.server.autocompleteURL}/`, {params}).then((response) => {

                if (response.status === 200) {
                    let data = response.data;

                    if (data !== []) {
                        setOptions(data);
                    }
                }
            },
            (error) => {
                console.log(error);
            });

    });

    const fetchSearchData = useCallback(() => {

        setTableLoading(true);

        var params = {
            limit: 150,
            offset: 0,
            q: searchQuery
        };

        axios.get(`${config.server.searchURL}/`, {params}).then((response) => {

            setTableLoading(false);
            setLoading(false);

            if (response.status === 200) {
                let data = response.data;

                setTotalCount(data.length);

                let idData = data.map(function (el, index) {
                    var obj = Object.assign({}, el);
                    obj.id = index;
                    return obj
                })
                setBankData(idData);
            }
        }, (error) => {

            setTableLoading(false);
            setLoading(false);

            console.log(error);
        })
    });

    const convertQuery = (query) => {
        if (query === null) {
            return ''
        } else if (typeof query === 'object') {
            return query.bankIFSC
        } else return query
    }

    const onSearchInputChange = (inputValue) => {

        var query = convertQuery(inputValue)
        setSearchQuery(query);

        if (query.length % 3 === 0) {
            if (query.length === 0) {
                fetchApiData();
            } else {
                fetchAutoSuggestData();
            }
        }
    };

    const onChangeInput = (inputValue) => {
        var inpVal = convertQuery(inputValue);

        if (inpVal.length === 0)
            fetchApiData();
        else fetchSearchData(inpVal);
    }

    useEffect(() => {
        fetchApiData();
    }, []);

    if (loading) {
        return (
            <Page pageTitle={'Bank Branches'}
                  contentStyle={{overflow: 'hidden'}}>
                <Grid
                    container
                    align="center"
                    justify="center"
                    direction="column"
                    style={{minHeight: "100%"}}>
                    <Grid item>
                        <CircularProgress/>
                    </Grid>
                </Grid>
            </Page>
        )
    } else {
        return (
            <Page
                pageTitle={'Bank Branches'}
                contentStyle={{overflow: 'hidden'}}
                appBarContent={
                    <Toolbar disableGutters>
                        <Autocomplete
                            id="asynchronous-demo"
                            style={{width: '45vw'}}
                            open={searchBarOpen}
                            placeholder={'Search'}
                            onOpen={() => {
                                setSearchBarOpen(true);
                                fetchAutoSuggestData();
                            }}
                            onClose={() => {
                                setSearchBarOpen(false);
                            }}
                            getOptionSelected={(option, value) => option === value}
                            getOptionLabel={(option) => {
                                if (typeof option === 'string' || option instanceof String)
                                    return option
                                else
                                    return `${option.bankBranch} ${option.bankIFSC} ${option.bankAddress} ${option.bankCity}`
                            }}
                            onInputChange={(input, value) => {
                                onSearchInputChange(value)
                            }}
                            onChange={(input, value) => {
                                onChangeInput(value);
                            }}
                            options={options}
                            loading={suggestionsLoading}
                            freeSolo={true}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    placeholder="Search"
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment: (<React.Fragment>
                                            <SearchIcon size={20}/>
                                        </React.Fragment>),
                                        endAdornment: (
                                            <React.Fragment>
                                                {suggestionsLoading ?
                                                    <CircularProgress color="inherit" size={20}/> : null}
                                                {params.InputProps.endAdornment}
                                            </React.Fragment>
                                        ),
                                    }}/>
                            )}/>
                    </Toolbar>
                }>
                <DataGrid
                    disableSelectionOnClick={true}
                    rows={bankData}
                    showToolbar={true}
                    rowHeight={100}
                    loading={tableLoading}
                    page={page}
                    rowCount={totalCount}
                    rowsPerPageOptions={[25, 50, 100]}
                    paginationMode={searchQuery === '' ? "server" : "client"}
                    onRowClick={(params) => {
                        markAsFavourite(params)
                    }}
                    onPageChange={(params) => {
                        handlePageChange(params)
                    }}
                    headerHeight={50}
                    columns={headCells}/>
                {<Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
                    <Alert severity="success" onClose={handleClose}>
                        {message}
                    </Alert>
                </Snackbar>}
            </Page>
        )
    }
}
