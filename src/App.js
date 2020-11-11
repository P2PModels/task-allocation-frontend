import React, { Suspense } from 'react'
import { HashRouter } from 'react-router-dom'
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import Web3 from 'web3'
import { Web3ReactProvider } from '@web3-react/core'
import theme from './theme'

import { ConnectProvider as Connect } from './contexts/Connect'
import { AppStateProvider } from './contexts/AppState'
import MainView from './components/MainView'
import Routes from './Routes'

const APP_NAME = process.env.REACT_APP_TASK_ALLOCATION_APP_NAME

function getLibrary(provider, connector) {
  return new Web3(provider)
}

function App() {
  return (
    <Suspense fallback="loading">
      <Web3ReactProvider getLibrary={getLibrary}>
        <Connect>
          <AppStateProvider appName={APP_NAME}>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <HashRouter>
                <MainView>
                  <Routes />
                </MainView>
              </HashRouter>
            </ThemeProvider>
          </AppStateProvider>
        </Connect>
      </Web3ReactProvider>
    </Suspense>
  )
}

export default App
