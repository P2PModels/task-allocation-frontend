// TODO: Build up app state
import React, { createContext, useState, useMemo, useContext } from 'react'
import FCFS_CONTRACT_ABI from '../assets/abis/RoundRobinApp'
import RR_CONTRACT_ABI from '../assets/abis/RoundRobinApp'
import RR_CAL_CONTRACT_ABI from '../assets/abis/RoundRobinApp'

// import useUser from '../hooks/useUser'

const APP_NAME = process.env.REACT_APP_TASK_ALLOCATION_APP_NAME

const models = [
  {
    name: 'fcfs',
    contractAddress: process.env.REACT_APP_RINKEBY_FCFS_CONTRACT_ADDRESS,
    contractAbi: FCFS_CONTRACT_ABI,
    endpoint: process.env.REACT_APP_FCFS_SUBGRAPH_ENDPOINT
  },
  {
    name: 'rr',
    contractAddress: process.env.REACT_APP_RINKEBY_RR_CONTRACT_ADDRESS,
    contractAbi: RR_CONTRACT_ABI,
    endpoint: process.env.REACT_APP_RR_SUBGRAPH_ENDPOINT
  },
  {
    name: 'rr-cal',
    contractAddress: process.env.REACT_APP_RINKEBY_RR_CAL_CONTRACT_ADDRESS,
    contractAbi: RR_CAL_CONTRACT_ABI,
    endpoint: process.env.REACT_APP_RR_CAL_SUBGRAPH_ENDPOINT
  }
]

// Set Round Robin as default model
const DEFAULT_MODEL_INDEX = 1

const AppStateContext = createContext()

export function AppStateProvider({ children }) {

  const [ appName, setAppName ] = useState(APP_NAME)
  const [ modelName, setModelName ] = useState(models[DEFAULT_MODEL_INDEX].name)
  const [ contractAddress, setContractAddress ] = useState(models[DEFAULT_MODEL_INDEX].contractAddress)
  const [ contractABI, setContractABI ] = useState(models[DEFAULT_MODEL_INDEX].contractAbi)
  const [ endpoint, setEndpoint ] = useState(models[DEFAULT_MODEL_INDEX].endpoint)

  const setModel = (name) => {
    let model = models.find(m => m.name === name)
    if(model){
      setModelName(model.name)
      setContractAddress(model.contractAddress)
      setContractABI(model.contractABI)
      setEndpoint(model.endpoint)
    }
  }

  const value = useMemo(() => {
    return ({
      appName,
      modelName,
      contractAddress,
      contractABI,
      endpoint,
      setModel      
    })
  }, [contractAddress, endpoint])

  return (
    <AppStateContext.Provider
      value={value}
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
