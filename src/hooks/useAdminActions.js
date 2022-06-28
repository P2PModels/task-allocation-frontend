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

// function useAdminActions(onReportStatus) {
//     const account = PUBLIC_KEY
//     const { library: web3 } = useWeb3React()
//     const { contractAddress, contractABI } = useAppState()
//     const [
//         processTransaction,
//         { txHash, receipt, loading, error },
//     ] = useTransaction()

//     const getContractInstance = useCallback((web3, abi) => {
//         // console.log(web3)
//         if (web3) {
//             return new web3.eth.Contract(abi)
//         }
//     }, [])

//     const restartContract = useCallback(() => {
//         try {
//             const modelContract = getContractInstance(web3, contractABI)
//             processTransaction(
//                 web3,
//                 {
//                     from: account,
//                     to: contractAddress,
//                     data: modelContract.methods['restart']().encodeABI(),
//                     gas: GAS_LIMIT,
//                 },
//                 true // use private key
//             )
//         } catch (err) {
//             console.error('Could not create tx:', err)
//             onReportStatus('error', RestartContract)
//         }
//     }, [web3])

//     const registerUsers = async () => {
//         users.map(async userId => {
//             await registerUser(userId)
//         })
//     }

//     const registerUser = useCallback(
//         async userId => {
//             const hexUserId = toBytes32(userId)

//             try {
//                 const modelContract = getContractInstance(web3, contractABI)
//                 await processTransaction(
//                     web3,
//                     {
//                         from: account,
//                         to: contractAddress,
//                         data: modelContract.methods['registerUser'](
//                             hexUserId
//                         ).encodeABI(),
//                         gas: GAS_LIMIT,
//                     },
//                     _ => {
//                         console.log(`registerUser Tx status: info`)
//                     },
//                     _ => {
//                         console.log(`registerUser Tx status: success`)
//                     },
//                     err => {
//                         console.error(err)
//                         console.log(`registerUser Tx status: error`)
//                     },
//                     true // use private key
//                 )
//             } catch (err) {
//                 console.error('Could not create tx:', err)
//                 onReportStatus('error', RegisterUser)
//             }
//         },
//         [web3]
//     )

//     const createTasks = async () => {
//         await mockTasks.map(async task => {
//             await createTask(task.job_id)
//         })
//     }

//     const restartPrototype = async () => {
//         await restartContract()
//         await registerUsers()
//         // createTasks()
//     }

//     return {
//         restartContract,
//         registerUser,
//         registerUsers,
//         createTask,
//         createTasks,
//         restartPrototype,
//     }
// }

// export default useAdminActions

const useAdminActions = () => {
    const account = PUBLIC_KEY
    // const { library: web3 } = getWeb3ReactContext()
    const { library: web3 } = useWeb3React()
    const { contractAddress, contractABI } = useAppState()
    // const [
    //     processTransaction,
    //     { data: txData, loading: txLoading, error: txError },
    // ] = useTransaction()
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
    // const STATES = {
    //     INITIAL,
    //     RESTARTING_CONTRACT,
    //     CONTRACT_RESTARTED,
    //     REGISTERING_USERS,
    //     USERS_REGISTERED,
    //     CREATING_TASKS,
    //     TASKS_CREATED,
    //     DONE,
    // }
    // const [status, setStatus] = useState(STATES.INITIAL)
    // const [loading, setLoading] = useState(false)
    // const [error, setError] = useState()

    // const launchTx = useCallback(
    //     async ({ methodName, vars, action }) => {
    //         try {
    //             await processTransaction(
    //                 web3,
    //                 {
    //                     from: account,
    //                     to: contractAddress,
    //                     data: modelContractInstance.methods[methodName](
    //                         ...vars
    //                     ).encodeABI(),
    //                     gas: GAS_LIMIT,
    //                 },
    //                 true // Use private key
    //             )
    //         } catch (err) {
    //             console.error('Could not create tx:', err)
    //             onReportStatus('error', action)
    //         }
    //     },
    //     [web3]
    // )

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

// export function useCreateTask(onReportStatus) {
//     const account = PUBLIC_KEY
//     const { library: web3 } = useWeb3React()
//     const { contractAddress, contractABI } = useAppState()
//     const { processTransaction } = useTransaction()

//     const [data, setData] = useState()
//     const [loading, setLoading] = useState(false)
//     const [error, setError] = useState()

//     const getContractInstance = useCallback((web3, abi) => {
//         // console.log(web3)
//         if (web3) {
//             return new web3.eth.Contract(abi)
//         }
//     }, [])

//     const createTask = async taskId => {
//         const hexTaskId = toBytes32(taskId)

//         try {
//             const modelContract = getContractInstance(web3, contractABI)
//             await processTransaction(
//                 web3,
//                 {
//                     from: account,
//                     to: contractAddress,
//                     data: modelContract.methods['createTask'](
//                         hexTaskId
//                     ).encodeABI(),
//                     gas: GAS_LIMIT,
//                 },
//                 _ => {
//                     console.log(`createTask Tx status: info`)
//                     onReportStatus('info', 'restart')
//                     setLoading(true)
//                 },
//                 receipt => {
//                     console.log(`createTask Tx status: success`)
//                     onReportStatus('success', 'restart')
//                     setLoading(false)
//                     setData(receipt)
//                 },
//                 err => {
//                     console.error(err)
//                     console.log(`createTask Tx status: error`)
//                     onReportStatus('error', 'restart')
//                     setLoading(false)
//                     setError(err)
//                 },
//                 true // use private key
//             )
//         } catch (err) {
//             console.error('Could not create tx:', err)
//             onReportStatus('error', CreateTask)
//         }
//     }

//     return [
//         createTask,
//         {
//             data,
//             loading,
//             error,
//         },
//     ]
// }
