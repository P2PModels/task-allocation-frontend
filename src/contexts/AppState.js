// TODO: Build up app state
import React, { createContext, useContext } from 'react'
import useOrgData from '../hooks/useOrgData'
// import useUser from '../hooks/useUser'

const AppStateContext = createContext()

export function AppStateProvider({ appName, children }) {
  const {
    config,
    errors,
    installedApps,
    loadingAppData,
    organization,
    roundRobinConnector,
  } = useOrgData(appName)

  // const { userErrors, user, loadingUserData } = useUser(
  //   userId,
  //   roundRobinConnector
  // )

  const appLoading =
    !errors && /* !userErrors */ loadingAppData /*  && loadingUserData */

  return (
    <AppStateContext.Provider
      value={{
        config,
        errors: { orgErrors: errors /* userErrors */ },
        installedApps,
        organization,
        isLoading: appLoading,
        roundRobinConnector,
        /* user, */
      }}
    >
      {children}
    </AppStateContext.Provider>
  )
}

export function useAppState() {
  const context = useContext(AppStateContext)

  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider')
  }

  return context
}
