import Page from 'material-ui-shell/lib/containers/Page'
import React, {useEffect, useState, useCallback, useMemo} from 'react'
import Scrollbar from 'material-ui-shell/lib/components/Scrollbar/Scrollbar'
import { useIntl } from 'react-intl'
import config from '../../config/config'
import List from '@material-ui/core/List'
import { ListPage } from 'material-ui-shell/lib/containers/Page'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import { DataGrid } from '@material-ui/data-grid';
import CircularProgress from '@material-ui/core/CircularProgress'
import axios from 'axios'
import Grid from "@material-ui/core/Grid";
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { lighten, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableFooter from '@material-ui/core/TableFooter';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';

const headCells = [
  { field: 'bankIFSC', width: 150, headerName: 'IFSC' },
  { field: 'bankId', type: 'number', width: 150, headerName: 'Bank ID' },
  { field: 'bankBranch', type: 'text', width: 150, headerName: 'Branch' },
  { field: 'bankAddress', width: 250, headerName: 'Address' },
  { field: 'bankCity', type: 'text', width: 160, headerName: 'City' },
  { field: 'bankDistrict', type: 'text', width: 150, headerName: 'District' },
  { field: 'bankState', type: 'text', width: 150, headerName: 'State' },
];

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  header: {
    position: 'fixed',
    top: 0,
  },
  footer: {
    position: 'fixed',
    bottom: 0,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

export default function HomePage() {

const intl = useIntl()
const [bankData, setBankData] = useState([])
const [loading, setLoading] = useState(true);

const classes = useStyles();
const [order, setOrder] = React.useState('asc');
const [orderBy, setOrderBy] = React.useState('bankIFSC');
const [selected, setSelected] = React.useState([]);
const [page, setPage] = React.useState(0);
const [dense, setDense] = React.useState(false);
const [rowsPerPage, setRowsPerPage] = React.useState(5);

const handleRequestSort = (event, property) => {
  const isAsc = orderBy === property && order === 'asc';
  setOrder(isAsc ? 'desc' : 'asc');
  setOrderBy(property);
};

const fetchApiData = useCallback(() => {

  const params = {
    page: 0,
    items: 30
  };  

  console.log('fetch api data called')
  axios.get(`${config.server.branchURL}/`, {params}).then((response) => {
    console.log('axios get called')
    if (response.status === 200) {
      let data = response.data;
      
      let idData = data.map(function(el, index) {
        var obj = Object.assign({}, el);
        obj.id = index;
        return obj
      })

      setBankData(idData);
      setLoading(false);
    }
  }, (error) => {
    console.log(error);
  })
});

useEffect(() => {
  fetchApiData();
  console.log('use effect called');
}, []);

if (loading) {
  return (
    <Page pageTitle={intl.formatMessage({ id: 'bank_branches' })}>
      <Grid
      container
      align="center"
      justify="center"
      direction="column"
      style={{ minHeight: "100%" }}>
      <Grid item>
        <CircularProgress />
      </Grid>
    </Grid>
    </Page>
  )
}
else {
  return (
    <Page 
    pageTitle={intl.formatMessage({ id: 'bank_branches', defaultMessage: 'Bank Branches' })} 
    contentStyle={{ overflow: 'hidden' }}>
      <DataGrid 
      rows={bankData}
      autoPageSize={true}
      showToolbar={true}
      rowHeight={100}
      headerHeight={50}
      columns={headCells} />
      </Page>
  )   
}
}
