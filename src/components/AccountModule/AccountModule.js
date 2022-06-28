import React, { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import useEagerConnect from '../../hooks/useEagerConnect'
import useInactiveListener from '../../hooks/useInactiveListener'
import { getNetwork } from '../../networks'
import { transformError } from '../../wallet-providers'
import { makeStyles } from '@material-ui/core/styles'
import { Button } from '@material-ui/core'

// import ExitToApp from '@material-ui/icons/ExitToApp'

import ProvidersModal from '../Modals/ProvidersModal'
import IdentityBadge from './IdentityBadge'
import MessageModal from '../Modals/MessageModal'

const useStyles = makeStyles(theme => ({
    wrapper: {
        display: 'flex',
        alignItems: 'center',
    },
    disconnectButton: {
        marginLeft: theme.spacing(1),
    },
}))

const AccountModule = () => {
    const { wrapper, disconnectButton } = useStyles()
    const web3React = useWeb3React()
    const {
        library,
        connector,
        account,
        chainId,
        activate,
        deactivate,
    } = web3React
    const [activatingConnector, setActivatingConnector] = useState()
    const [openModal, setOpenModal] = useState(false)
    const [error, setError] = useState(undefined)
    const networkName = !isNaN(chainId) ? getNetwork(chainId).name : ''
    // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
    const [triedEager] = useEagerConnect()
    // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
    useInactiveListener(!triedEager || !!activatingConnector)

    const handleSelectProvider = currentConnector => {
        if (!activatingConnector) {
            setActivatingConnector(currentConnector)
            /* Third function argument allows us to emit a promise
      so we can catch it and close modal in case everything
      went right */
            activate(currentConnector, null, true).then(
                () => {
                    console.log('Connector has been activated')
                    setOpenModal(false)
                },
                err => {
                    console.log(err)
                    setError(transformError(err))
                    setActivatingConnector(undefined)
                    setOpenModal(false)
                }
            )
        }
    }

    useEffect(() => {
        if (activatingConnector && activatingConnector === connector) {
            setActivatingConnector(undefined)
        }
    }, [activatingConnector, connector])

    return (
        <div className={wrapper}>
            {account ? (
                <React.Fragment>
                    <IdentityBadge entity={account} network={networkName} />
                    <Button
                        variant="contained"
                        color="secondary"
                        size="small"
                        className={disconnectButton}
                        onClick={() => deactivate()}
                    >
                        Disconnect
                    </Button>
                </React.Fragment>
            ) : (
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setOpenModal(true)}
                >
                    Connect Account
                </Button>
            )}

            <ProvidersModal
                open={openModal}
                activating={!!activatingConnector}
                onSelect={handleSelectProvider}
                onClose={() => setOpenModal(false)}
            />
            <MessageModal
                open={!!error}
                type={error ? error.type : ''}
                title={error ? error.title : ''}
                message={error ? error.msg : ''}
                onClose={() => setError(undefined)}
            />
        </div>
    )
}

export default AccountModule
