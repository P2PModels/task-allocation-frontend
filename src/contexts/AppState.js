// TODO: Build up app state
import React, { createContext, useState, useMemo, useContext } from 'react'
import models from '../types/models'

// import useUser from '../hooks/useUser'

const APP_NAME = process.env.REACT_APP_TASK_ALLOCATION_APP_NAME

// Set Round Robin as default model
const DEFAULT_MODEL_INDEX = 0

const AppStateContext = createContext()

export function AppStateProvider({ children }) {
    const [appName, setAppName] = useState(APP_NAME)
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

    const setModel = name => {
        let model = models.find(m => m.name === name)
        if (model) {
            setModelName(model.name)
            setModelDisplayName(model.displayName)
            setContractAddress(model.contractAddress)
            setContractABI(model.contractABI)
            setEndpoint(model.endpoint)
        }
    }

    const value = useMemo(() => {
        return {
            appName,
            modelName,
            modelDisplayName,
            contractAddress,
            contractABI,
            endpoint,
            setModel,
        }
    }, [contractAddress, endpoint])

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
