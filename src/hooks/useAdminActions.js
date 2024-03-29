import { useState, useCallback, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { getWeb3ReactContext } from '@web3-react/core'
import { useAppState } from '../contexts/AppState'
import { Actions } from '../types/actions'
import { toBytes32 } from '../helpers/web3-helpers'
import { users as mockUsers, mockTasks } from '../mock-data'
import useTransaction from './useTransaction'
import useBulkTransactions from './useBulkTransactions'

const PUBLIC_KEY = process.env.REACT_APP_AMARA_PUBLIC_ADDRESS
const GAS_LIMIT = 450000
const GAS_PRICE = 2000000000
const { RestartContract, RegisterUser, CreateTask } = Actions

const useAdminActions = () => {
    const account = PUBLIC_KEY
    const { library: web3 } = useWeb3React()
    const { contractAddress, contractABI } = useAppState()
    const [
        processBulkTransactions,
        { data, loading, error },
    ] = useBulkTransactions()

    const getContractInstance = useCallback((web3, abi) => {
        // console.log(web3)
        if (web3) {
            return new web3.eth.Contract(abi)
        }
    }, [])

    const restartPrototype = useCallback(() => {
        const modelContractInstance = getContractInstance(web3, contractABI)

        const restartContractTxParams = {
            from: account,
            to: contractAddress,
            data: modelContractInstance.methods['restart']().encodeABI(),
            gas: GAS_LIMIT,
            gasPrice: GAS_PRICE,
        }

        const bulkUserRegisterTxParams = mockUsers.map(user => {
            return {
                from: account,
                to: contractAddress,
                data: modelContractInstance.methods['registerUser'](
                    toBytes32(user)
                ).encodeABI(),
                gas: GAS_LIMIT,
                gasPrice: GAS_PRICE,
            }
        })

        const bulkCreateTaskTxParams = mockTasks.map(task => {
            return {
                from: account,
                to: contractAddress,
                data: modelContractInstance.methods['createTask'](
                    toBytes32(task.job_id)
                ).encodeABI(),
                gas: GAS_LIMIT,
                gasPrice: GAS_PRICE,
            }
        })

        processBulkTransactions(
            web3,
            [
                restartContractTxParams,
                ...bulkUserRegisterTxParams,
                ...bulkCreateTaskTxParams,
            ],
            true // Use private key
        )
    }, [web3])

    return [restartPrototype, { data, loading, error }]
}

export default useAdminActions
