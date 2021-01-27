import React, { Component } from 'react'
import App from 'base-shell/lib'
import MUIConfig from 'material-ui-shell/lib'
import merge from 'base-shell/lib/utils/config'
import _config from './config'

const config = merge(MUIConfig, _config)

export default class ReactApp extends Component {
  render() {
    return <App config={config} />
  }
}

// export default function ReactApp() {
//   return (
//     <React.Suspense>
//       <App config={config} />
//     </React.Suspense>
//   );
// }
