/* eslint-disable react/jsx-key */
import React, {lazy} from 'react'
import {Route} from 'react-router-dom'

const Dashboard = lazy(() => import('../pages/dashboard'))

const routes = [
    <Route path="/dashboard" exact component={Dashboard}/>
]

export default routes
