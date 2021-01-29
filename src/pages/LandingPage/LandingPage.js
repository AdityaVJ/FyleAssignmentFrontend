import React from 'react'
import Home from '../Home/Home'
import { Link, BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'

const LandingPage = () => {
  return (
    <Redirect to="/home" />
  );
}
export default LandingPage