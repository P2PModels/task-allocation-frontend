import { hexToUtf8, timestampToDate } from './web3-helpers'

export function transformConfigData(config) {
    return {
        ...config,
    }
}

export function generateUserId(hexUserId, appAddress) {
    return `appAddress:${appAddress}-userId:${hexUserId}`
}

export function transformUserData(contractUser) {
    if (contractUser.allocatedTasks && contractUser.acceptedTasks) {
        const transformedAllocatedTasks = contractUser.allocatedTasks.map(t =>
            transformTaskData(t)
        )
        const transformedAcceptedTasks = contractUser.acceptedTasks.map(t =>
            transformTaskData(t)
        )
        return {
            ...contractUser,
            allocatedTasks: transformedAllocatedTasks,
            acceptedTasks: transformedAcceptedTasks,
        }
    } else {
        return {
            ...contractUser,
        }
    }
}

export function transformTaskData(task) {
    if (task.endDate) {
        return {
            ...task,
            endDate: timestampToDate(task.endDate),
        }
    }

    return {
        ...task,
    }
}

export function mergeUserData(contractUser, amaraUser) {
    const { id: entityId, available, benefits } = contractUser
    return {
        ...amaraUser,
        id: amaraUser.username,
        entityId,
        available,
        benefits,
    }
}

export function mergeTaskData(contractTasks, amaraTasks) {
    return contractTasks.map(cT => {
        const amaraTask = amaraTasks.find(aT => aT.job_id === cT.id)

        return {
            contractData: { ...cT },
            ...amaraTask,
        }
    })
}
