import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import FCFSHome from './pages/FCFSHome'
// import Admin from './pages/Admin'
import Admin from './pages/Admin2'
import { useAppState } from './contexts/AppState'
import models from './types/models'

function Routes() {
    const { modelName } = useAppState()

    let homeComponent

    switch (modelName) {
        // FCFS
        case models[0].name:
            homeComponent = FCFSHome
            break

        // RR
        // case models[0].name:
        //     homeComponent = RRHome
        //     break

        // Default FCFS
        default:
            homeComponent = FCFSHome
            break
    }

    return (
        <Switch>
            <Redirect exact from="/" to="/home"></Redirect>
            <Route path="/home" component={homeComponent} />
            {/* Add admin provider */}
            <Route path="/admin" component={Admin} />
        </Switch>
    )
}

export default Routes
