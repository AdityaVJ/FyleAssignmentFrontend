import Page from 'material-ui-shell/lib/containers/Page'
import React from 'react'
import Scrollbar from 'material-ui-shell/lib/components/Scrollbar/Scrollbar'
import { useIntl } from 'react-intl'
import config from '../../config/config'

const HomePage = () => {
  const intl = useIntl()

  return (
    <Page pageTitle={intl.formatMessage({ id: 'bank_branches' })}>
      <Scrollbar style={{ height: '100%', width: '100%', display: 'flex', flex: 1 }}>
        {config.server.banksUrl}
      </Scrollbar>
    </Page>
  )
}
export default HomePage
