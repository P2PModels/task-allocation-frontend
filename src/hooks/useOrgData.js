import { useState, useEffect, useMemo } from 'react'
import {
  useApp,
  useApps,
  useOrganization,
  usePermissions,
} from '@aragon/connect-react'
import connectRoundRobin from '@p2pmodels/connect-round-robin'
import { addressesEqual } from '../helpers/web3-utils'
import { useConfigSubscription } from './useSubscriptions'

function useOrgData(appName) {
  const [roundRobinConnector, setRoundRobinConnector] = useState(null)
  const [organization, orgStatus] = useOrganization()
  const [apps, appsStatus] = useApps()
  const [taRoundRobinApp] = useApp(appName)
  const [permissions, permissionsStatus] = usePermissions()

  const taRoundRobinAppPermissions = useMemo(() => {
    if (
      !permissions ||
      permissionsStatus.loading ||
      permissionsStatus.error ||
      !taRoundRobinApp
    ) {
      return
    }
    return permissions.filter(({ appAddress }) =>
      addressesEqual(appAddress, taRoundRobinApp.address)
    )
  }, [taRoundRobinApp, permissions, permissionsStatus])

  useEffect(() => {
    if (!taRoundRobinApp) {
      return
    }

    let cancelled = false

    const fetchRoundRobinConnector = async () => {
      try {
        const roundRobinConnector = await connectRoundRobin(taRoundRobinApp)
        if (!cancelled) {
          setRoundRobinConnector(roundRobinConnector)
        }
      } catch (err) {
        console.error(`Error fetching round robin connector: ${err}`)
      }
    }

    fetchRoundRobinConnector()

    return () => {
      cancelled = true
    }
  }, [taRoundRobinApp])

  const config = useConfigSubscription(roundRobinConnector)

  const loadingData =
    orgStatus.loading ||
    appsStatus.loading ||
    permissionsStatus.loading ||
    !config

  const errors = orgStatus.error || appsStatus.error || permissionsStatus.error

  return {
    config,
    errors,
    roundRobinConnector,
    installedApps: apps,
    organization,
    permissions: taRoundRobinAppPermissions,
    loadingAppData: loadingData,
  }
}

export default useOrgData
