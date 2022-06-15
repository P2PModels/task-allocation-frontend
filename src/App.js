import React, { Suspense } from 'react'
import { HashRouter } from 'react-router-dom'
import { ThemeProvider } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import Web3 from 'web3'
import { Web3ReactProvider } from '@web3-react/core'
import theme from './theme'

// import { ConnectProvider as Connect } from './contexts/Connect'
import { BackendProvider as Backend } from './contexts/BackendProvider'
import { AppStateProvider } from './contexts/AppState'
import MainView from './components/MainView'
import Routes from './Routes'


function getLibrary(provider, connector) {
  return new Web3(provider)
}

function App() {
  return (
    <Suspense fallback="loading">
      <AppStateProvider>
        <Web3ReactProvider getLibrary={getLibrary}>
          {/* <Connect> */}
          <Backend>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <HashRouter>
                <MainView>
                  <Routes />
                </MainView>
              </HashRouter>
            </ThemeProvider>
          </Backend>
          {/* </Connect> */}
        </Web3ReactProvider>
      </AppStateProvider>
    </Suspense>
  )
}

export default App
