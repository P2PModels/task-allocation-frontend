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
import {
    FCFS_TASKS,
    FCFS_USERS,
    USER_TASKS_BY_STATUS,
    USER,
    FCFS_USER,
} from '../queries/queries'

const POLL_INTERVAL = 5000

export function useFCFSUserQuery(userId) {
    const { contractAddress } = useAppState()
    const [user, setUser] = useState(null)
    const hexUserId = toBytes32(userId)

    const onUserHandler = useCallback(data => {
        let user = data.user
        setUser(user)
    }, [])

    const onUserErrorHanlder = err => {
        console.log('[onUserErrorHandler] Error: ')
        console.log(err)
    }

    const userQuery = useRef(
        useQuery(FCFS_USER, {
            variables: {
                id: generateUserId(hexUserId, contractAddress),
            },
            onCompleted: onUserHandler,
            onError: onUserErrorHanlder,
        })
    )

    return user
}

export function useUserQuery(userId) {
    const { contractAddress } = useAppState()
    const [user, setUser] = useState(null)
    const hexUserId = toBytes32(userId)
    const rawUserRef = useRef(null)

    const onUserHandler = useCallback(data => {
        let user = data.user

        const rawUser = JSON.stringify(user)
        if (rawUserRef && rawUserRef.current === rawUser) {
            return
        }

        rawUserRef.current = rawUser
        const transformedUser = transformUserData(user)
        setUser(transformedUser)
    }, [])

    const onUserErrorHanlder = err => {
        console.log('[onUserErrorHandler] Error: ')
        console.log(err)
    }

    const userQuery = useRef(
        useQuery(USER, {
            variables: {
                id: generateUserId(hexUserId, contractAddress),
            },
            onCompleted: onUserHandler,
            onError: onUserErrorHanlder,
        })
    )

    return user
}

export function useTasksForUserQueryPolling(
    userId,
    status,
    { first, skip } = { first: 50, skip: 0 }
) {
    // We had to change the logic from a fake subscription (aragon does this)
    // to a query that uses polling

    const { contractAddress } = useAppState()
    const [userTasks, setUserTasks] = useState([])
    const hexUserId = toBytes32(userId)
    const convertedStatus = [convertToInt(status)]

    const onTasksForUserHandler = useCallback(
        data => {
            // console.log("[onTaskForUserHandler] Tasks: ");
            // console.log(tasks)
            // Get current date and time
            const currentDate = new Date()
            // Adjust structure of obtained tasks
            const transformedTasks = data.tasks.map(t => transformTaskData(t))
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
        console.log('[onTasksForUserErrorHandler] Error: ')
        console.log(err)
    }

    const tasksPolling = useRef(
        useQuery(USER_TASKS_BY_STATUS, {
            variables: {
                statuses: convertedStatus,
                userId: generateUserId(hexUserId, contractAddress),
                first,
                skip,
            },
            pollInterval: POLL_INTERVAL,
            onCompleted: onTasksForUserHandler,
            onError: onTasksForUserErrorHanlder,
        })
    )

    useEffect(() => {
        if (tasksPolling.current.loading) {
            return
        } else if (tasksPolling.current.error) {
            console.log('[onTaskForUserHandler] Error: ')
            console.log(tasksPolling.current.error)
            return () => tasksPolling.current.stopPolling()
        }

        // console.log("[useTasksForUserQueryPolling]")
        // console.log(tasksPolling.current)
        onTasksForUserHandler(tasksPolling.current.data)
        return () => tasksPolling.current.stopPolling()
    }, [tasksPolling, onTasksForUserHandler])

    return userTasks
}

export function useTasksQueryPolling({ first, skip } = { first: 50, skip: 0 }) {
    const [tasks, setTasks] = useState(null)

    const onTasksHandler = useCallback(
        data => {
            setTasks(data.tasks)
        },
        [tasks]
    )

    const onTasksErrorHanlder = err => {
        console.log('[onTasksErrorHandler] Error: ')
        console.log(err)
    }

    const tasksPolling = useRef(
        useQuery(FCFS_TASKS, {
            variables: {
                first,
                skip,
            },
            pollInterval: POLL_INTERVAL,
            onCompleted: onTasksHandler,
            onError: onTasksErrorHanlder,
        })
    )

    useEffect(() => {
        if (tasksPolling.current.loading) {
            return
        } else if (tasksPolling.current.error) {
            console.log('[onTaskForUserHandler] Error: ')
            console.log(tasksPolling.current.error)
            return () => tasksPolling.current.stopPolling()
        }
        console.log('[useTasksQueryPolling]')
        console.log(tasksPolling.current)
        onTasksHandler(tasksPolling.current.data.tasks)
        return () => tasksPolling.current.stopPolling()
    }, [tasksPolling, onTasksHandler])

    return tasks
}

export function useUsersQuery({ first, skip } = { first: 50, skip: 0 }) {
    const [users, setUsers] = useState(null)

    const onUserssHandler = useCallback(
        data => {
            setUsers(data.users)
        },
        [users]
    )

    const onUserssErrorHanlder = err => {
        console.log('[onUserssErrorHanlder] Error: ')
        console.log(err)
    }

    const usersQuery = useRef(
        useQuery(FCFS_USERS, {
            variables: {
                first,
                skip,
            },
            onCompleted: onUserssHandler,
            onError: onUserssErrorHanlder,
        })
    )

    return users
}
