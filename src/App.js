import React, { Suspense } from 'react'
import { HashRouter } from 'react-router-dom'
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import Web3 from 'web3'
import { Web3ReactProvider, createWeb3ReactRoot } from '@web3-react/core'
import theme from './theme'

import { ConnectProvider as Connect } from './contexts/Connect'
import { BackendProvider as Backend } from './contexts/BackendProvider'
import { AppStateProvider } from './contexts/AppState'
import Routes from './Routes'

function getLibrary(provider) {
    return new Web3(provider)
}

// const AdminWeb3ReactProvider = createWeb3ReactRoot('adminProvider')

function App() {
    return (
        <Suspense fallback="loading">
            <Web3ReactProvider getLibrary={getLibrary}>
                <Connect>
                    <AppStateProvider>
                        {/* <AdminWeb3ReactProvider getLibrary={getLibrary}>
                            <Connect networkOnlyConnector> */}
                        <Backend>
                            <ThemeProvider theme={theme}>
                                <CssBaseline />
                                <HashRouter>
                                    <Routes />
                                </HashRouter>
                            </ThemeProvider>
                        </Backend>
                        {/* </Connect>
                        </AdminWeb3ReactProvider> */}
                    </AppStateProvider>
                </Connect>
            </Web3ReactProvider>
        </Suspense>
    )
}

export default App
