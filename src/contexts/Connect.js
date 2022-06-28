import React, { useEffect } from 'react'
import { Connectors } from 'web3-react'
import { getNetwork } from '../networks'
import { useWeb3React } from '@web3-react/core'

const ConnectProvider = ({ networkOnlyConnector = false, children }) => {
    const { InjectedConnector, NetworkOnlyConnector } = Connectors
    const { chainId } = getNetwork()
    const web3React = useWeb3React()

    useEffect(() => {
        const connect = async () => {
            let connector = networkOnlyConnector
                ? new NetworkOnlyConnector({
                      providerURL: process.env.REACT_APP_INFURA_ENDPOINT,
                  })
                : new InjectedConnector({
                      supportedChainIds: [chainId],
                  })

            // console.log('The connector is')
            // console.log(connector)
            const result = await web3React.activate(connector)
            // console.log('Activating:')
            // console.log(result)
        }
        connect()

        return web3React.deactivate()
    }, [])

    return <>{children}</>
}

export { ConnectProvider }
