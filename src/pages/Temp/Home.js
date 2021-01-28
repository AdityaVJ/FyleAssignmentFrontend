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

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'ifsc', numeric: false, disablePadding: true, label: 'IFSC' },
  { id: 'bank_id', numeric: true, disablePadding: true, label: 'Bank ID' },
  { id: 'branch', numeric: false, disablePadding: true, label: 'Branch' },
  { id: 'address', numeric: false, disablePadding: true, label: 'Address' },
  { id: 'city', numeric: false, disablePadding: true, label: 'City' },
  { id: 'district', numeric: false, disablePadding: true, label: 'District' },
  { id: 'state', numeric: false, disablePadding: true, label: 'State' },
];

function EnhancedTableHead(props) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
      <Grid
          colSpan={7}
          container
          direction="row"
          justify="flex-start"
          alignItems="center"
          spacing={2}>
        {/* <TableCell colSpan={1} padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all desserts' }}
          />
        </TableCell> */}
        {headCells.map((headCell) => (
          <Grid xs={1}>
          <TableCell
            key={headCell.id}
            align='center'
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
          </Grid>
        ))}
        </Grid>
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === config.theme.defaultType
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: '1 1 100%',
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      
      {/* {numSelected > 0 ? (
        <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
          {numSelected} selected
        </Typography>
      ) : (
        <Typography className={classes.title} variant="h6" id="tableTitle" component="div">
          Branches
        </Typography>
      )}*/}

      {numSelected > 0 ? (
        <Grid container justify="flex-end">
        <Grid item>
        <Tooltip placement="top-end" title="Delete">
          <IconButton aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
        </Grid>
        </Grid>
      ) : (
        <Grid container justify="flex-end">
          <Grid item>
        <Tooltip placement="top-end" title="Filter list">
          <IconButton aria-label="filter list">
            <FilterListIcon />
          </IconButton>
        </Tooltip>
        </Grid>
        </Grid>
      )}
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

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
      setBankData(data);
      setLoading(false);
    }
  }, (error) => {
    console.log(error);
  })
});

const handleSelectAllClick = (event) => {
  if (event.target.checked) {
    const newSelecteds = bankData.map((n) => n.ifsc);
    setSelected(newSelecteds);
    return;
  }
  setSelected([]);
};

const handleClick = (event, name) => {
  const selectedIndex = selected.indexOf(name);
  let newSelected = [];

  if (selectedIndex === -1) {
    newSelected = newSelected.concat(selected, name);
  } else if (selectedIndex === 0) {
    newSelected = newSelected.concat(selected.slice(1));
  } else if (selectedIndex === selected.length - 1) {
    newSelected = newSelected.concat(selected.slice(0, -1));
  } else if (selectedIndex > 0) {
    newSelected = newSelected.concat(
      selected.slice(0, selectedIndex),
      selected.slice(selectedIndex + 1),
    );
  }

  setSelected(newSelected);
};

const handleChangePage = (event, newPage) => {
  setPage(newPage);
};

const handleChangeRowsPerPage = (event) => {
  setRowsPerPage(parseInt(event.target.value, 10));
  setPage(0);
};

const isSelected = (name) => selected.indexOf(name) !== -1;
const emptyRows = rowsPerPage - Math.min(rowsPerPage, bankData.length - page * rowsPerPage);


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
        <Paper className={classes.root}>
          <EnhancedTableToolbar
          numSelected={selected.length} />
          <TableContainer>
            <Table
              className={classes.table}
              aria-labelledby="tableTitle"
              size={dense ? 'small' : 'medium'}
              aria-label="enhanced table">
              <EnhancedTableHead
                numSelected={selected.length}
                order={order}
                orderBy={orderBy}
                onSelectAllClick={handleSelectAllClick}
                onRequestSort={handleRequestSort}
                rowCount={bankData.length}
              />
              </Table>
        <Table>
        <div style={{ overflow: "auto", height: '100vh', width: 'auto'}} >
              <TableBody>
                {stableSort(bankData, getComparator(order, orderBy))
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((bankData, index) => {
                    const isItemSelected = isSelected(bankData.ifsc);
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, bankData.ifsc)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={bankData.ifsc}
                        selected={isItemSelected}
                      >
                        {/* <TableCell padding="checkbox">
                          <Checkbox
                            checked={isItemSelected}
                            inputProps={{ 'aria-labelledby': labelId }}
                          />
                        </TableCell> */}
                        <TableCell component="th" id={labelId} scope="row" padding="default">
                          {bankData.bankIFSC}
                        </TableCell>
                        <TableCell align="center">{bankData.bankId}</TableCell>
                        <TableCell align="center">{bankData.bankBranch}</TableCell>
                        <TableCell align="center">{bankData.bankAddress}</TableCell>
                        <TableCell align="center">{bankData.bankCity}</TableCell>
                        <TableCell align="center">{bankData.bankDistrict}</TableCell>
                        <TableCell align="center">{bankData.bankState}</TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows === 0 &&(
                  <TableRow style={{ height: (dense ? 33 : 53) * 5 }}>
                  <TableCell colSpan={8} />
                </TableRow>  
                  )}
                {emptyRows > 0 && (
                  <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                    <TableCell colSpan={8} />
                  </TableRow>
                )}
              </TableBody>
              </div>
              <TableFooter>
          <TablePagination
          className={classes.footer}
            showFirstButton={true}
            rowsPerPageOptions={[5, 10, 25]}
            count={bankData.length}
            component="div"
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
          </TableFooter>
            </Table>
          </TableContainer>
        </Paper>
      </Page>
  )   
}
}
