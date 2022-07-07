import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import HomeFCFS from './pages/HomeFCFS'
import HomeRR from './pages/HomeRR'
// import Admin from './pages/Admin'
import AdminFCFS from './pages/AdminFCFS'
import AdminRR from './pages/AdminRR'
import Config from './pages/Config'
import { useAppState } from './contexts/AppState'
import models from './types/models'

function Routes() {
    const { modelName } = useAppState()

    let homeComponent, adminComponent

    switch (modelName) {
        // FCFS
        case models[0].name:
            homeComponent = HomeFCFS
            adminComponent = AdminFCFS
            break

        // RR
        case models[1].name:
            homeComponent = HomeRR
            adminComponent = AdminRR
            break

        // Default FCFS
        default:
            homeComponent = HomeFCFS
            break
    }

    return (
        <Switch>
            <Redirect exact from="/" to="/config"></Redirect>
            <Route path="/config" component={Config} />
            <Route path="/home" component={homeComponent} />
            {/* Add admin provider */}
            <Route path="/admin" component={adminComponent} />
        </Switch>
    )
}

export default Routes
