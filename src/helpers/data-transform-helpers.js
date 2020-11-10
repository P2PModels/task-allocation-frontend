import { getFieldFromEntityId } from './app-connector-helpers'
import { hexToUtf8, timestampToDate } from '../helpers/web3-utils'

export function transformConfigData(config) {
  return {
    ...config,
  }
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
  const entityId = task.id
  const endDate = task.endDate
  return {
    ...task,
    entityId,
    id: hexToUtf8(getFieldFromEntityId(entityId, 'taskId')),
    endDate: timestampToDate(endDate),
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
    console.log(cT)
    return {
      contractData: { ...cT },
      ...amaraTask,
    }
  })
}
