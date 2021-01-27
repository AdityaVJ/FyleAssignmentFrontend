import Page from 'material-ui-shell/lib/containers/Page'
import React, {useEffect, useState, useCallback, useMemo} from 'react'
import Scrollbar from 'material-ui-shell/lib/components/Scrollbar/Scrollbar'
import { useIntl } from 'react-intl'
import config from '../../config/config'
import { ListPage } from 'material-ui-shell/lib/containers/Page'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import list from './data.json'
import Divider from '@material-ui/core/Divider'
import CircularProgress from '@material-ui/core/CircularProgress'
import axios from 'axios'
import Grid from "@material-ui/core/Grid";

const Row = ({ index, style, data }) => {
  const { name, id } = data

  return (
    <div key={`${name}`} style={style}>
      <ListItem alignItems="flex-start">
        <ListItemText
          primary={`${name}`}
          secondary={
            <React.Fragment>
              <Typography
                component="span"
                variant="body2"
                color="textSecondary">
                {id}
              </Typography>
              <br />
              <Typography
                component="span"
                variant="body2"
                color="textSecondary">
                {`${id} ${id}`}
              </Typography>
              <br />
              <Typography
                component="span"
                variant="body2"
                color="textSecondary">
                  {`User is active: ${id}`}
                </Typography>
            </React.Fragment>
          }
        />
      </ListItem>
      <Divider />
    </div>
  )
}

export default function HomePage() {

const intl = useIntl()
const [bankData, setBankData] = useState([])
const [loading, setLoading] = useState(true);

const fetchApiData = useCallback(() => {

  console.log('fetch api data called')
  axios.get(config.server.banksUrl).then((response) => {
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

useEffect(() => {
  fetchApiData();
  console.log('use effect called');
}, []);
  /*
  return (
    <Page pageTitle={intl.formatMessage({ id: 'bank_branches' })}>
      <Scrollbar style={{ height: '100%', width: '100%', display: 'flex', flex: 1 }}>
        {config.server.banksUrl}
      </Scrollbar>
    </Page>
  )*/

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
    <ListPage
      name="list_demo"
      list={bankData}
      // fields={fields}
      onClick={() => alert('Hi, you have clicked an item!')}
      Row={Row}
      listProps={{ itemSize: 110 }}
      getPageProps={(list) => {
        return {
          pageTitle: intl.formatMessage(
            {
              id: 'bank_branches',
            },
            { count: list.length }
          ),
        }
      }}
    />
  )   
}
}
//export default HomePage
