// TODO: Build up app state
import React, {
    createContext,
    useState,
    useEffect,
    useMemo,
    useContext,
} from 'react'
import models from '../types/models'
import { useWeb3React } from '@web3-react/core'

// import useUser from '../hooks/useUser'

const APP_NAME = process.env.REACT_APP_TASK_ALLOCATION_APP_NAME

// Set Round Robin as default model
const DEFAULT_MODEL_INDEX = 1

const AppStateContext = createContext()

export function AppStateProvider({ children }) {
    const [appName, setAppName] = useState(APP_NAME)
    const { library: web3 } = useWeb3React()
    const [modelName, setModelName] = useState(models[DEFAULT_MODEL_INDEX].name)
    const [modelDisplayName, setModelDisplayName] = useState(
        models[DEFAULT_MODEL_INDEX].displayName
    )
    const [contractAddress, setContractAddress] = useState(
        models[DEFAULT_MODEL_INDEX].contractAddress
    )
    const [contractABI, setContractABI] = useState(
        models[DEFAULT_MODEL_INDEX].contractAbi
    )
    const [endpoint, setEndpoint] = useState(
        models[DEFAULT_MODEL_INDEX].endpoint
    )
    const [userId, setUserId] = useState()
    const [modelContractInstance, setModelContractInstance] = useState()

    const getContractInstance = (web3, abi, contractAddress) => {
        if (web3 && abi) {
            return new web3.eth.Contract(abi, contractAddress)
        }
    }

    useEffect(() => {
        if (web3 && contractABI && contractAddress) {
            const instance = getContractInstance(
                web3,
                contractABI,
                contractAddress
            )
            setModelContractInstance(instance)
            console.log('[AppStateContext] Setting contract instance')
            console.log(instance)
        }
    }, [web3, contractABI, contractAddress])

    const setModel = name => {
        let model = models.find(m => m.name === name)
        if (model) {
            console.log('Setting model')
            console.log(model.contractAddress)
            setModelName(model.name)
            setModelDisplayName(model.displayName)
            setContractAddress(model.contractAddress)
            setContractABI(model.contractAbi)
            setEndpoint(model.endpoint)
        }
    }

    const setUser = userId => {
        setUserId(userId)
    }

    const value = useMemo(() => {
        return {
            appName,
            modelName,
            modelDisplayName,
            modelContractInstance,
            contractAddress,
            contractABI,
            endpoint,
            setModel,
            userId,
            setUser,
        }
    }, [modelContractInstance, contractAddress, endpoint, modelName])

    return (
        <AppStateContext.Provider value={value}>
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
