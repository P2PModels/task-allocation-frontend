import { UnsupportedChainIdError } from '@web3-react/core'
import {
    InjectedConnector,
    NoEthereumProviderError,
    UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector'
import MetamaskLogo from './assets/MetamaskLogo.png'

export const injected = new InjectedConnector({
    supportedChainIds: [1, 4, 5],
})

export const connectorsByName = {
    Injected: {
        name: 'Metamask',
        logo: MetamaskLogo,
        connector: injected,
    },
}

export function transformError(error) {
    const err = { type: 'error' }
    if (error instanceof NoEthereumProviderError) {
        err.title = 'No Ethereum Provider'
        err.msg =
            'No Ethereum browser extension detected, install MetaMask on browser.'
        err.displayComponent = 'modal'
    } else if (error instanceof UnsupportedChainIdError) {
        err.title = 'Wrong Network'
        err.msg = "You're connected to an unsupported network."
        err.displayComponent = 'modal'
    } else if (error instanceof UserRejectedRequestErrorInjected) {
        err.msg =
            'Please authorize this website to access your Ethereum account.'
        err.displayComponent = 'snackbar'
    } else {
        console.error(error)
        err.title = 'Unknown Error'
        err.msg =
            'An unknown error occurred. Check the console for more details.'
        err.displayComponent = 'modal'
    }
    return err
}
