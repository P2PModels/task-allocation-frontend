import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import Home from './pages/Home'

function Routes() {
  return (
    <Switch>
      <Redirect exact from="/" to="/home"></Redirect>
      <Route path="/home" component={Home} />
      <Redirect to="/home" />
    </Switch>
  )
}

export default Routes
