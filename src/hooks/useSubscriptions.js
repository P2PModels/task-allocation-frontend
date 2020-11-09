import { useCallback, useEffect, useRef, useState } from 'react'
import {
  transformConfigData,
  transformTaskData,
  transformUserData,
} from '../helpers/data-transform-helpers'
import { useAppState } from '../contexts/AppState'
import { toBytes32 } from '../helpers/web3-utils'
import { convertToInt } from '../types'

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

export function useUserSubscription(userId) {
  const { roundRobinConnector } = useAppState()
  const [user, setUser] = useState(null)
  const rawUserRef = useRef(null)
  const userSubscription = useRef(null)

  const onUserHandler = useCallback((err, user) => {
    if (err || !user) {
      return
    }

    const rawUser = JSON.stringify(user)
    if (rawUserRef && rawUserRef.current === rawUser) {
      return
    }

    rawUserRef.current = rawUser
    const transformedUser = transformUserData(user)
    setUser(transformedUser)
  }, [])

  useEffect(() => {
    if (!roundRobinConnector) {
      return
    }
    const userIdHex = toBytes32(userId)
    userSubscription.current = roundRobinConnector.onUser(
      userIdHex,
      onUserHandler
    )
    return () => userSubscription.current.unsubscribe()
  }, [roundRobinConnector, userId, onUserHandler])

  return user
}

export function useTasksForUserSubscription(
  userId,
  status,
  { first, skip } = {}
) {
  const { roundRobinConnector } = useAppState()
  const [userTasks, setUserTasks] = useState([])
  const tasksSubscription = useRef(null)

  const onTasksForUserHandler = useCallback((err, tasks = []) => {
    console.log('suscription')
    console.log(tasks)
    if (err || !tasks) {
      return
    }

    const transformedTasks = tasks.map(t => transformTaskData(t))
    setUserTasks(transformedTasks)
  }, [])

  useEffect(() => {
    if (!roundRobinConnector) {
      return
    }

    const hexUserId = toBytes32(userId)
    const convertedStatus = [convertToInt(status)]
    console.log(hexUserId)
    console.log(convertedStatus)
    // roundRobinConnector
    //   .tasksForUser(hexUserId, convertedStatus, {
    //     first: 1000,
    //     skip: 0,
    //   })
    //   .then(res => {
    //     console.log('resss')
    //     console.log(res)
    //   })
    tasksSubscription.current = roundRobinConnector.onTasksForUser(
      hexUserId,
      convertedStatus,
      { first: 1000, skip: 0 },
      onTasksForUserHandler
    )
    return () => tasksSubscription.current.unsubscribe()
  }, [roundRobinConnector, userId, status, first, skip, onTasksForUserHandler])

  return userTasks
}
