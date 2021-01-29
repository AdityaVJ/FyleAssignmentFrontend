/* eslint-disable react/jsx-key */
import React, { lazy } from 'react'
import { Route } from 'react-router-dom'

const Home = lazy(() => import('../pages/Home/Home'))
const DialogDemo = lazy(() => import('../pages/DialogDemo/DialogDemo'))
const FilterDemo = lazy(() => import('../pages/FilterDemo'))
const ListPageDemo = lazy(() => import('../pages/ListPageDemo'))
const TabsDemo = lazy(() => import('../pages/TabsDemo'))

const routes = [
  <Route path="/home" exact component={Home} />,
  <Route path="/dialog_demo" exact component={DialogDemo} />,
  <Route path="/filter_demo" exact component={FilterDemo} />,
  <Route path="/list_page_demo" exact component={ListPageDemo} />,
  <Route path="/tabs_demo" exact component={TabsDemo} />,
]

export default routes
