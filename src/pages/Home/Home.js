import Page from 'material-ui-shell/lib/containers/Page'
import React, {useEffect, useState, useCallback, useMemo} from 'react'
import { useIntl } from 'react-intl'
import config from '../../config/config'
import { DataGrid } from '@material-ui/data-grid';
import CircularProgress from '@material-ui/core/CircularProgress'
import axios from 'axios'
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';
import Grid from "@material-ui/core/Grid";
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';

export default function HomePage() {

const intl = useIntl()
const [bankData, setBankData] = useState([])
const [loading, setLoading] = useState(true);
const [tableLoading, setTableLoading] = useState(false);
const [open, setOpen] = useState(false);
const [page, setPage] = React.useState(1);
const [message, setMessage] = React.useState('');
const [totalCount, setTotalCount] = React.useState(0);

const headCells = [
  {
    field: 'favourites',
    headerName: 'Favourite',
    width: 150,
    renderCell: (params) => {
    return (
      <div>
        <IconButton color="primary" aria-label="add to favourites" component="span">
          {checkFavouriteItem(params.row.bankIFSC) ? (<StarIcon />): (<StarBorderIcon />)}
        </IconButton>
        </div>
    )
  }
  },
  { field: 'bankIFSC', width: 150, headerName: 'IFSC' },
  { field: 'bankId', type: 'number', width: 150, headerName: 'Bank ID' },
  { field: 'bankBranch', type: 'text', width: 150, headerName: 'Branch' },
  { field: 'bankAddress', width: 250, headerName: 'Address' },
  { field: 'bankCity', type: 'text', width: 160, headerName: 'City' },
  { field: 'bankDistrict', type: 'text', width: 150, headerName: 'District' },
  { field: 'bankState', type: 'text', width: 150, headerName: 'State' },
];

const handleClose = () => {
  setOpen(false);
}

const handlePageChange = (params) => {
  setTableLoading(true);
  setPage(params.page);
  fetchApiData();
};

const checkFavouriteItem = (itemID) => {
  const item = localStorage.getItem(itemID);
  if (!item) return false
  else return true
}

const markAsFavourite = useCallback((params) => {
  const ifsc = params.row.bankIFSC;
  if(!checkFavouriteItem(ifsc)) {
    setMessage(`${ifsc} successfully added to favourites!`)
    localStorage.setItem(ifsc, ifsc);
    setOpen(true);
  }
  else {
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

      let idData = branches.map(function(el, index) {
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

useEffect(() => {
  fetchApiData();
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
      disableSelectionOnClick={true}
      rows={bankData}
      showToolbar={true}
      rowHeight={100}
      loading={tableLoading}
      page={page}
      rowCount={totalCount}
      rowsPerPageOptions={[25, 50, 100]}
      paginationMode="server"
      onRowClick={(params) => {markAsFavourite(params)}}
      onPageChange={(params) => {handlePageChange(params)}}
      headerHeight={50}
      columns={headCells} />
      {<Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
            <Alert severity="success" onClose={handleClose}>
            {message}
            </Alert>
        </Snackbar>}
      </Page>
  )   
}
}
