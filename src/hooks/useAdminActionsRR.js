import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useAppState } from '../contexts/AppState'
import { Actions } from '../types/actions'
import { toBytes32 } from '../helpers/web3-helpers'
import { users as mockUsers, mockTasks, REALLOCATION_TIME } from '../mock-data'
import useBulkTransactions from './useBulkTransactions'
import useManager from './useManager'

const PUBLIC_KEY = process.env.REACT_APP_AMARA_PUBLIC_ADDRESS
const GAS_LIMIT = 450000 // Reallocation spends around 150 gas
const GAS_PRICE = 8000000000 //1 Gwei
const { RestartContract, RegisterUser, CreateTask } = Actions

const MAXIMUM_RETRIES = 5

const useAdminActions = log => {
    const account = PUBLIC_KEY
    const { library: web3 } = useWeb3React()
    const { contractAddress, modelContractInstance, modelName } = useAppState()
    const [processBulkTransactions, bulkTxsRecord] = useBulkTransactions()
    const {
        start,
        stop,
        running,
        scheduledJobs,
        txsRecord: managerTxsRecord,
    } = useManager(web3, account, GAS_LIMIT, GAS_PRICE, log)

    const startManager = tasks => start(tasks)

    const stopManager = () => stop()

    const restartPrototype = useCallback(() => {
        // console.log('%cRestarting prototype...', 'color: aqua')
        // console.log(modelName)
        // console.log(contractAddress)

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
                    toBytes32(task.job_id),
                    REALLOCATION_TIME
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
    }, [web3, modelContractInstance, modelName])

    return {
        startManager,
        stopManager,
        managerRunning: running,
        jobs: scheduledJobs,
        txsRecord: {
            data: {
                txsHash: [
                    ...managerTxsRecord.data.txsHash,
                    ...bulkTxsRecord.data.txsHash,
                ],
                receipts: [
                    ...managerTxsRecord.data.receipts,
                    ...bulkTxsRecord.data.receipts,
                ],
            },
            error: [...managerTxsRecord.error, ...bulkTxsRecord.error],
        },
        restartPrototype,
        restartPrototypeLoading: bulkTxsRecord.loading,
    }
}

export default useAdminActions
