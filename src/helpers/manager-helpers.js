import { hexToAscii, timestampToDate } from './web3-helpers'

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

import { ASSIGNED_NUM } from './types/taskStatusesRR'

async function sendTransaction(contractInstance, method, args = []) {
    const txResponse = await contractInstance[method](...args)
    const txReceipt = await txResponse.wait()
    console.log(` ${method} called on tx ${txReceipt.transactionHash} `)
    return txReceipt
}
/**
 * Logs event info
 *
 * @param  {} userId
 */
function userRegisteredHandler(userId) {
    if (userId) {
        console.log(
            `${USER_REGISTERED} event - User ${hexToAscii(userId)} created`
        )
    } else {
        console.log(`${USER_REGISTERED} event - No params received`)
    }
}
/**
 * Logs event info
 *
 * @param  {} userId
 */
function userDeletedHandler(userId) {
    if (userId) {
        console.log(
            `${USER_DELETED} event - User ${hexToAscii(userId)} deleted`
        )
    } else {
        console.log(`${USER_DELETED} event - No params received`)
    }
}
/**
 * Logs event info
 *
 * @param  {} userId
 */
function taskCreatedHandler(taskId) {
    if (taskId) {
        console.log(
            `${TASK_CREATED} event - Task ${hexToAscii(taskId)} created`
        )
    } else {
        console.log(`${TASK_CREATED} event - No params received`)
    }
}

async function taskAllocatedHandler(
    cronJobs,
    modelContractInstance,
    { userId, taskId }
) {
    if (taskId && userId) {
        // endDate indicates when the task should be
        // reallocated
        const { endDate } = await modelContractInstance.getTask(taskId)
        const endDateNumber = endDate.toNumber()

        console.log(
            `${TASK_ALLOCATED} event - Task ${hexToAscii(
                taskId
            )} has been assigned to ${hexToAscii(
                userId
            )} and will be reassigned on ${timestampToHour(endDateNumber)}`
        )

        let cronJob
        // Check if there is already a cron job for the taskId
        if (cronJobs.has(taskId)) {
            // If there is already a cron job for the taskId,
            // the cronjob is obtained and set a new time considering
            // its endDate
            cronJob = cronJobs.get(taskId)
            cronJob.setTime(new CronTime(timestampToDate(endDateNumber)))
        } else {
            // If the task is being assigned for the first time, a cron job
            // is created and saved into cronJobs
            cronJob = createReallocationCronJob(
                modelContractInstance,
                taskId,
                endDateNumber
            )
            cronJobs.set(taskId, cronJob)
        }
        cronJob.start()
    } else {
        console.log(`${TASK_ALLOCATED} event - No params received`)
    }
}

function taskRejectedHandler(cronJobs, rrContract, { userId, taskId }) {
    if (taskId && userId) {
        console.log(
            `${TASK_REJECTED} event - Task ${hexToAscii(
                taskId
            )} rejected by ${hexToAscii(userId)}`
        )
        if (cronJobs.has(taskId)) {
            // Whenever a rejected task event is received the cronjob is stopped
            cronJobs.get(taskId).stop()
        }
        // The rejected task indicated by taskId is reassigned
        sendTransaction(rrContract, 'reallocateTask', [taskId])
    } else {
        // This else was implemented to control for situations in which
        // the task rejected task event is emitted without parameters
        console.log(`${TASK_REJECTED} event - No params received`)
    }
}

function taskAcceptedHandler(cronJobs, { userId, taskId }) {
    if (taskId && userId) {
        console.log(
            `${TASK_ACCEPTED} event - Task ${hexToAscii(
                taskId
            )} accepted by user ${hexToAscii(userId)}`
        )
        if (cronJobs.has(taskId)) {
            // Whenever an accepted task event is received the corresponding cronjob
            // is stopped
            cronJobs.get(taskId).stop()
        }
    } else {
        console.log(`${TASK_ACCEPTED} event - No params received`)
    }
}

function taskDeletedHandler(cronJobs, { taskId }) {
    if (taskId) {
        console.log(
            `${TASK_DELETED} event - Task ${hexToAscii(taskId)} deleted`
        )
        if (cronJobs.has(taskId)) {
            // Whenever a deleted task event is received the corresponding cronjob
            // is stopped
            cronJobs.get(taskId).stop()
        }
    } else {
        console.log(`${TASK_DELETED} event - No params received`)
    }
}

function rejecterDeletedHandler(userId, taskId) {
    console.log(
        `${REJECTER_DELETED} event - Task ${hexToAscii(
            taskId
        )} rejecter ${hexToAscii(userId)} deleted`
    )
}

export async function setUpEventListeners(cronJobs, modelContractInstance) {
    modelContractInstance.on(USER_REGISTERED, userRegisteredHandler)
    modelContractInstance.on(USER_DELETED, userDeletedHandler)
    modelContractInstance.on(TASK_CREATED, taskCreatedHandler)
    modelContractInstance.on(TASK_ALLOCATED, (userId, taskId) =>
        taskAllocatedHandler(cronJobs, modelContractInstance, {
            userId,
            taskId,
        })
    )
    modelContractInstance.on(TASK_ACCEPTED, (userId, taskId) =>
        taskAcceptedHandler(cronJobs, { userId, taskId })
    )
    modelContractInstance.on(TASK_REJECTED, (userId, taskId) =>
        taskRejectedHandler(cronJobs, modelContractInstance, { userId, taskId })
    )
    modelContractInstance.on(TASK_DELETED, taskId =>
        taskDeletedHandler(cronJobs, { taskId })
    )
    modelContractInstance.on(REJECTER_DELETED, rejecterDeletedHandler)

    console.log('Events listeners set up')
}

// TODO Change cron to timeouts
function createReallocationCronJob(modelContractInstance, taskId, timestamp) {
    const executionDate = timestampToDate(timestamp)

    // reallocateTask is called when executionDate arrives
    return setTimeout(() => {
        sendTransaction(modelContractInstance, 'reallocateTask', [
            taskId,
        ]).then(() =>
            console.log(
                `Job ${hexToAscii(taskId)} executed on ${executionDate}`
            )
        )
    }, executionDate)
    // return new CronJob(executionDate, function () {
    //     sendTransaction(modelContractInstance, 'reallocateTask', [taskId]).then(() =>
    //         console.log(
    //             `Job ${hexToAscii(taskId)} executed on ${executionDate}`
    //         )
    //     )
    // })
}

/**
 * Function implemented to create scheduled jobs for tasks that were
 * already allocated. The primary use case is for situations when
 * the ether manager stops and there're tasks already allocated. These
 * already allocated tasks exist in the contract but their scheduled jobs
 * are lost. So, new scheduled jobs need to be created for these tasks.
 */
export async function createJobsForAllocatedTasks(
    scheduledJobs,
    modelContractInstance,
    tasks
) {
    // Get task ids
    // const tasksIds = mockTasks
    //     .map(({ job_id: taskId }) => taskId)
    //     .slice(0, INITIAL_TASKS)
    //     .map(tId => ethers.utils.formatBytes32String(tId))

    // Get tasks from the contract given taskIds
    // Promise.all receives an array of promises and return an error
    // if some of the given promises fail. If no error occurr, meaning,
    // for this case, all tasks exist in the contract.
    // const tasks = await Promise.all(
    //     tasksIds.map(tId => modelContractInstance.getTask(tId))
    // )

    // Select only those tasks that were assigned. Tasks that were accepted,
    // rejected, or completed are filtered out.
    const allocatedTasks = tasks.filter(t => Number(t.status) === ASSIGNED_NUM)

    let scheduledJob

    console.log(`Preparing existing  and assigned tasks`)

    allocatedTasks.forEach(task => {
        const timestamp = task.endDate

        if (timestamp - Date.now() > 0) {
            // Schedule job
            const timerId = setTimeout(() => {}, timestamp - Date.now())
        }
    })
    for (let i = 0; i < allocatedTasks.length; i++) {
        // endDate is the time when the task should have been
        // reasigned
        const { endDate: timestamp } = allocatedTasks[i]
        const now = new Date()
        const endDate = timestampToDate(timestamp.toNumber())
        const tId = tasksIds[i]
        // If the task's end date has already passed, task should be reallocated
        if (endDate <= now) {
            await sendTransaction(modelContractInstance, 'reallocateTask', [
                tId,
            ])
        } else {
            // If the task's end date hasn't already passed, the task is still valid
            // so the cronjob is created
            console.log(
                'Creating job for existing task ' +
                    hexToAscii(tId) +
                    ' for ' +
                    endDate
            )
            scheduledJob = createReallocationCronJob(
                modelContractInstance,
                tId,
                timestamp.toNumber()
            )
            scheduledJobs.set(tId, cronJob)
            scheduledJob.start()
        }
    }
}
