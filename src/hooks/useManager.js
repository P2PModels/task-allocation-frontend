import { useState, useRef } from 'react'
import { useAppState } from '../contexts/AppState'
import { hexToAscii, toBytes32, hexToUtf8 } from '../helpers/web3-helpers'
import {
    USER_REGISTERED,
    USER_DELETED,
    TASK_CREATED,
    TASK_ALLOCATED,
    TASK_ACCEPTED,
    TASK_REJECTED,
    TASK_DELETED,
    REJECTER_DELETED,
} from '../types/events'
import { TaskStatuses, convertToString } from '../types/taskStatusesRR'
import { REALLOCATION_TIME } from '../mock-data'

import useQueuedTransactions from './useQueuedTransactions'

const useManager = (web3, account, GAS_LIMIT, GAS_PRICE, log) => {
    const { contractAddress, modelContractInstance } = useAppState()
    const [running, setRunning] = useState(false)
    const [queueTransaction, stopQueue, txsRecord] = useQueuedTransactions()
    const scheduledJobs = useRef(new Map())
    const handledEvents = useRef(new Map())

    function createJob(web3, txParams, taskId, timeout) {
        // console.log(
        //     `%c[createJob] Creating reallocation job for task ${taskId} in ${
        //         timeout / 1000
        //     }s`,
        //     'color: pink'
        // )
        return {
            taskId,
            timerId: setTimeout(async () => {
                queueTransaction(web3, txParams, true)
                // console.log(
                //     `%c[createJob] Scheduled job for ${taskId} executed.`,
                //     'color: pink'
                // )
            }, timeout),
            endDate: Date.now() + timeout,
            tx: {
                data: {
                    hash: null,
                    receipt: null,
                },
                loading: false,
                error: null,
            },
        }
    }

    function userRegisteredHandler(userId) {
        // if (userId) {
        //     console.log(`${USER_REGISTERED} event - User ${userId} created`)
        // } else {
        //     console.log(`${USER_REGISTERED} event - No params received`)
        // }
    }

    function userDeletedHandler(userId) {
        // if (userId) {
        //     console.log(`${USER_DELETED} event - User ${userId} deleted`)
        // } else {
        //     console.log(`${USER_DELETED} event - No params received`)
        // }
    }

    function taskCreatedHandler(taskId) {
        // if (taskId) {
        //     console.log(`${TASK_CREATED} event - Task ${taskId} created`)
        // } else {
        //     console.log(`${TASK_CREATED} event - No params received`)
        // }
    }

    const taskAllocatedHandler = async function (taskId, userId) {
        if (taskId && userId) {
            // Get current task end date (s)
            const { endDate } = await modelContractInstance.methods['getTask'](
                toBytes32(taskId)
            ).call()

            const endDateMillis = endDate * 1000

            // console.log(
            //     `${TASK_ALLOCATED} event - Task ${taskId} has been assigned to ${userId} and will be reassigned on ${new Date(
            //         endDateMillis
            //     ).toLocaleTimeString()}, current time is: ${new Date(
            //         Date.now()
            //     ).toLocaleTimeString()}`
            // )

            log(
                `${TASK_ALLOCATED} event - Task ${taskId} has been assigned to ${userId} and will be reassigned on ${new Date(
                    endDateMillis
                ).toLocaleTimeString()}, current time is: ${new Date(
                    Date.now()
                ).toLocaleTimeString()}`,
                'info'
            )

            let scheduledJob
            // Check if there is already a scheduled job for the taskId
            if (scheduledJobs.current.has(taskId)) {
                scheduledJobs.current.delete(taskId)
            }
            const reallocateTaskTxParams = {
                from: account,
                to: contractAddress,
                data: modelContractInstance.methods['reallocateTask'](
                    toBytes32(taskId)
                ).encodeABI(),
                gas: GAS_LIMIT,
                gasPrice: GAS_PRICE,
            }
            scheduledJob = createJob(
                web3,
                reallocateTaskTxParams,
                taskId,
                endDateMillis - Date.now() // timeout
            )
            scheduledJobs.current.set(scheduledJob.taskId, scheduledJob)
        } else {
            // console.log(
            //     `${TASK_ALLOCATED} event - No params received. Task id: ${taskId}, User id: ${userId}`
            // )
        }
    }

    function taskAcceptedHandler(userId, taskId) {
        if (taskId && userId) {
            // console.log(
            //     `${TASK_ACCEPTED} event - Task ${taskId} accepted by user ${userId}`
            // )
            log(
                `${TASK_ACCEPTED} event - Task ${taskId} accepted by user ${userId}`,
                'info'
            )
            if (scheduledJobs.current.has(taskId)) {
                // Whenever an accepted task event is received the corresponding cronjob
                // is stopped
                clearTimeout(scheduledJobs.current.get(taskId).timerId)
                scheduledJobs.current.delete(taskId)
            }
        } else {
            // console.log(`${TASK_ACCEPTED} event - No params received`)
        }
    }

    function taskRejectedHandler(userId, taskId) {
        if (taskId && userId) {
            // console.log(
            //     `${TASK_REJECTED} event - Task ${taskId} rejected by ${userId}`
            // )
            if (scheduledJobs.current.has(taskId)) {
                // Whenever a rejected task event is received the cronjob is stopped
                clearTimeout(scheduledJobs.current.get(taskId).timerId)
                scheduledJobs.current.delete(taskId)
            }

            // The rejected task indicated by taskId is reassigned

            // Prepare tx params
            const reallocateTaskTxParams = {
                from: account,
                to: contractAddress,
                data: modelContractInstance.methods['reallocateTask'](
                    toBytes32(taskId)
                ).encodeABI(),
                gas: GAS_LIMIT,
                gasPrice: GAS_PRICE,
            }

            // Reallocate task now
            // console.log(
            //     `%c[manageTasks] Reallocating task ${taskId}`,
            //     'color: lightgreen'
            // )
            queueTransaction(web3, reallocateTaskTxParams, true)
        } else {
            // console.log(`${TASK_REJECTED} event - No params received`)
        }
    }

    function taskDeletedHandler({ taskId }) {
        if (taskId) {
            // console.log(`${TASK_DELETED} event - Task ${taskId} deleted`)
            if (scheduledJobs.current.has(taskId)) {
                // Whenever a deleted task event is received the corresponding cronjob
                // is stopped
                scheduledJobs.current.delete(taskId)
            }
        } else {
            // console.log(`${TASK_DELETED} event - No params received`)
        }
    }

    function rejecterDeletedHandler(userId, taskId) {
        // console.log(
        //     `${REJECTER_DELETED} event - Task ${taskId} rejecter ${userId} deleted`
        // )
    }

    async function setUpEventListeners() {
        // console.log('Set up event listeners!')

        modelContractInstance.events[USER_REGISTERED]({}, (error, event) => {
            if (!handledEvents.current.get(event.id)) {
                handledEvents.current.set(event.id, true)
                userRegisteredHandler(hexToUtf8(event.returnValues.userId))
            }
        })
        modelContractInstance.events[USER_DELETED]({}, (error, event) => {
            if (!handledEvents.current.get(event.id)) {
                handledEvents.current.set(event.id, true)
                userDeletedHandler(hexToUtf8(event.returnValues.userId))
            }
        })
        modelContractInstance.events[TASK_CREATED]({}, (error, event) => {
            if (!handledEvents.current.get(event.id)) {
                handledEvents.current.set(event.id, true)
                taskCreatedHandler(hexToUtf8(event.returnValues.taskId))
            }
        })
        modelContractInstance.events[TASK_ALLOCATED](
            {},
            async (error, event) => {
                if (!handledEvents.current.get(event.id)) {
                    handledEvents.current.set(event.id, true)
                    const { taskId, userId } = event.returnValues
                    await taskAllocatedHandler(
                        hexToUtf8(taskId),
                        hexToUtf8(userId)
                    )
                }
            }
        )
        modelContractInstance.events[TASK_ACCEPTED]({}, (error, event) => {
            if (!handledEvents.current.get(event.id)) {
                handledEvents.current.set(event.id, true)
                taskAcceptedHandler(
                    hexToUtf8(event.returnValues.userId),
                    hexToUtf8(event.returnValues.taskId)
                )
            }
        })
        modelContractInstance.events[TASK_REJECTED]({}, (error, event) => {
            if (!handledEvents.current.get(event.id)) {
                handledEvents.current.set(event.id, true)
                taskRejectedHandler(
                    hexToUtf8(event.returnValues.userId),
                    hexToUtf8(event.returnValues.taskId)
                )
            }
        })
        modelContractInstance.events[TASK_DELETED]({}, (error, event) => {
            if (!handledEvents.current.get(event.id)) {
                handledEvents.current.set(event.id, true)
                taskDeletedHandler(hexToUtf8(event.returnValues.taskId))
            }
        })
        modelContractInstance.events[REJECTER_DELETED]({}, (error, event) => {
            if (!handledEvents.current.get(event.id)) {
                handledEvents.current.set(event.id, true)
                rejecterDeletedHandler(
                    hexToUtf8(event.returnValues.userId),
                    hexToUtf8(event.returnValues.taskId)
                )
            }
        })

        // console.log('Events listeners set up')

        // console.log(modelContractInstance)
    }

    /**
     * Reallocates timed out tasks and scheduled jobs for upcoming tasks
     */
    async function manageTasks(tasks) {
        // Filter assigned tasks
        const filteredTasks = tasks.filter(
            t =>
                t.status === convertToString(TaskStatuses.Assigned) ||
                t.status === convertToString(TaskStatuses.Rejected) ||
                t.status === convertToString(TaskStatuses.Available)
        )
        // console.log('%c[manageTasks] Tasks to manage:', 'color: lightgreen')
        // console.log(filteredTasks)

        if (filteredTasks.length)
            // Create jobs or reallocate for each one
            filteredTasks.forEach(task => {
                const now = new Date()
                const timestamp = new Date(task.endDate * 1000)

                // console.log(
                //     `%c[manageTasks] Managing task ${
                //         task.id
                //     }, endDate: ${timestamp.toLocaleTimeString()}`,
                //     'color: lightgreen'
                // )

                // Prepare tx params
                const reallocateTaskTxParams = {
                    from: account,
                    to: contractAddress,
                    data: modelContractInstance.methods['reallocateTask'](
                        toBytes32(task.id)
                    ).encodeABI(),
                    gas: GAS_LIMIT,
                    gasPrice: GAS_PRICE,
                }

                if (timestamp > now) {
                    // Create scheduled job
                    let scheduledJob = createJob(
                        web3,
                        reallocateTaskTxParams,
                        task.id,
                        timestamp - now
                    )

                    // Update jobs ref
                    scheduledJobs.current.set(scheduledJob.taskId, scheduledJob)
                } else {
                    // Reallocate task now
                    // console.log(
                    //     `%c[manageTasks] Reallocating task ${task.id}`,
                    //     'color: lightgreen'
                    // )
                    queueTransaction(web3, reallocateTaskTxParams, true)
                }
            })
    }

    const start = async tasks => {
        // console.log('Starting manager...')
        setRunning(true)

        // console.log('Executing events listener script...')
        setUpEventListeners()

        // console.log('Managing tasks...')
        await manageTasks(tasks)

        // console.log('[useManager] modelContractInstnce after manager start:')
        // console.log(modelContractInstance)
    }

    const stop = () => {
        // console.log('Stopping manager...')
        // Update state
        setRunning(false)

        // Clear timers and jobs
        let clearJobs = [...scheduledJobs.current]
        clearJobs.forEach(([k, v]) => {
            console.log(v)
            clearTimeout(v.timerId)
        })
        // setScheduledJobs(new Map())
        scheduledJobs.current = new Map()
        handledEvents.current = new Map()

        // Clear txs queue
        stopQueue()

        // Disconnect from contract events
        // modelContractInstance.clearSubscriptions()
        web3.eth.clearSubscriptions()
        // console.log('Stopped')
    }

    return {
        start,
        stop,
        running,
        scheduledJobs: scheduledJobs.current,
        txsRecord,
    }
}

export default useManager
