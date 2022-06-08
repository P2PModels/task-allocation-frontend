import { useCallback, useEffect, useRef, useState } from 'react'
import {
  transformConfigData,
  transformTaskData,
  transformUserData,
  generateUserId,
} from '../helpers/data-transform-helpers'
import { useAppState } from '../contexts/AppState'
import { toBytes32 } from '../helpers/web3-helpers'
import { TaskStatuses, convertToInt, convertToString } from '../types'
import { useQuery } from '@apollo/client'
import { USER_TASKS_BY_STATUS, USER } from '../queries/queries'

const POLL_INTERVAL = 5000

// TODO: remove Aragon
export function useConfigSubscription(roundRobinConnector) {
  const [config, setConfig] = useState(null)

  const rawConfigRef = useRef(null)
  const configSubscription = useRef(null)

  const onConfigHandler = useCallback((err, config) => {
    if (err || !config) {
      return
    }

    const rawConfig = JSON.stringify(config)
    if (rawConfigRef && rawConfigRef.current === rawConfig) {
      return
    }

    rawConfigRef.current = rawConfig
    const transformedConfig = transformConfigData(config)
    setConfig(transformedConfig)
  }, [])

  useEffect(() => {
    if (!roundRobinConnector) {
      return
    }

    configSubscription.current = roundRobinConnector.onConfig(onConfigHandler)

    return () => configSubscription.current.unsubscribe()
  }, [roundRobinConnector, onConfigHandler])

  return config
}

export function useUserQuery(userId) {
  const { config } = useAppState()
  const [user, setUser] = useState(null)
  const hexUserId = toBytes32(userId)
  const rawUserRef = useRef(null)

  const onUserHandler = useCallback(
    data => {
      let user = data.user

      const rawUser = JSON.stringify(user)
      if (rawUserRef && rawUserRef.current === rawUser) {
        return
      }

      rawUserRef.current = rawUser
      const transformedUser = transformUserData(user)
      setUser(transformedUser)
    }, []
  )

  const onUserErrorHanlder = err => {
    console.log("[onUserErrorHandler] Error: ")
    console.log(err)
  }

  const userQuery = useRef(
    useQuery(USER, {
      variables: {
        id: generateUserId(hexUserId,config.appAddress),
      },
      onCompleted: onUserHandler,
      onError: onUserErrorHanlder
    })
  )

  return user
}

export function useTasksForUserQueryPolling(
  userId,
  status,
  { first, skip } = { first: 1000, skip: 0 }
) {

  // We had to change the logic from a fake subscription (aragon does this)
  // to a query that uses polling

  const { config } = useAppState()
  const [userTasks, setUserTasks] = useState([])
  const hexUserId = toBytes32(userId)
  const convertedStatus = [convertToInt(status)]

  const onTasksForUserHandler = useCallback(
    data => {
      let tasks = data.tasks
      console.log("[onTaskForUserHandler] Tasks: ");
      console.log(tasks)
      // Get current date and time
      const currentDate = new Date()
      // Adjust structure of obtained tasks
      const transformedTasks = tasks.map(t => transformTaskData(t))
      // Filter out tasks with rejected status
      const filteredTasks = transformedTasks.filter(
        t => t.status !== convertToString(TaskStatuses.Rejected)
      )
      if (status === TaskStatuses.Available) {
        // Filter out tasks whose end data has expired
        const availableTasks = filteredTasks.filter(
          t => t.endDate > currentDate
        )
        setUserTasks(availableTasks)
      } else {
        setUserTasks(filteredTasks)
      }
    },
    [status]
  )

  const onTasksForUserErrorHanlder = err => {
      console.log("[onTasksForUserErrorHandler] Error: ")
      console.log(err)
    }

  const tasksPolling = useRef(
    useQuery(USER_TASKS_BY_STATUS, {
      variables: {
        statuses: convertedStatus,
        userId: generateUserId(hexUserId,config.appAddress),
        first,
        skip
      },
      pollInterval: POLL_INTERVAL,
      onCompleted: onTasksForUserHandler,
      onError: onTasksForUserErrorHanlder
    })
  )

  useEffect(() => {
    if(tasksPolling.current.loading){
      return
    }
    console.log("[useTasksForUserQueryPolling]")
    console.log(tasksPolling.current)
    onTasksForUserHandler(tasksPolling.current.error, tasksPolling.current.data.tasks)
    return () => tasksPolling.current.stopPolling()
  }, [tasksPolling, onTasksForUserHandler])

  return userTasks
}
