import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import Home from './pages/Home'
// import Admin from './pages/Admin'

function Routes() {
  return (
    <Switch>
      <Redirect exact from="/" to="/home"></Redirect>
      <Route path="/home" component={Home} />
      {/* TODO: remove aragon dependencies */}
      {/* <Route path="/admin" component={Admin} /> */}
    </Switch>
  )
}

export default Routes
