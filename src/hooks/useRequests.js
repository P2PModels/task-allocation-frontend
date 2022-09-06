import { useCallback, useEffect, useRef, useState } from 'react'
import {
    transformTaskData,
    generateUserId,
} from '../helpers/data-transform-helpers'
import { useAppState } from '../contexts/AppState'
import { toBytes32 } from '../helpers/web3-helpers'
import { useQuery } from '@apollo/client'
import models from '../types/models'

const POLL_INTERVAL = 5000

export function useUsersQuery({ first, skip } = { first: 50, skip: 0 }) {
    const [users, setUsers] = useState(null)
    const { modelName } = useAppState()
    const model = models.find(m => m.name === modelName)

    const onUsersHandler = data => {
        setUsers(data.users)
        console.log('%cUsers loaded', 'color:violet')
    }

    const onUsersErrorHanlder = err => {
        console.log('[onUsersErrorHanlder] Error: ')
        console.log(err)
    }

    const usersQuery = useRef(
        useQuery(model.requests.users, {
            variables: {
                first,
                skip,
            },
            onCompleted: onUsersHandler,
            onError: onUsersErrorHanlder,
        })
    )

    const refetch = () => {
        usersQuery.current.refetch({
            first,
            skip,
        })
    }

    return { users, refetch }
    // return { users, refetch: usersQuery.current.refetch }
}

export function useUserQuery(userId) {
    const { contractAddress, modelName } = useAppState()
    const [user, setUser] = useState(null)
    const hexUserId = toBytes32(userId)
    const model = models.find(m => m.name === modelName)

    const onUserHandler = useCallback(data => {
        let user = data.user
        setUser(user)
    }, [])

    const onUserErrorHanlder = err => {
        console.log('[onUserErrorHandler] Error: ')
        console.log(err)
    }

    const userQuery = useRef(
        useQuery(model.requests.user, {
            variables: {
                id: generateUserId(hexUserId, contractAddress),
            },
            onCompleted: onUserHandler,
            onError: onUserErrorHanlder,
        })
    )

    return user
}

export function useTasksQueryPolling({ first, skip } = { first: 50, skip: 0 }) {
    const [tasks, setTasks] = useState(null)
    const { modelName } = useAppState()
    const model = models.find(m => m.name === modelName)

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
        useQuery(model.requests.tasks, {
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

    return { tasks, refetch: tasksPolling.current.refetch }
}

export function useAvailableTasksQueryPolling(
    userId,
    { first, skip } = { first: 50, skip: 0 }
) {
    const [tasks, setTasks] = useState(null)
    const { modelName } = useAppState()
    const model = models.find(m => m.name === modelName)

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
        useQuery(model.requests.tasksAvailable, {
            variables: {
                userId,
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
        // console.log('[useTasksQueryPolling]')
        // console.log(tasksPolling.current)
        onTasksHandler(tasksPolling.current.data.tasks)
        return () => tasksPolling.current.stopPolling()
    }, [tasksPolling, onTasksHandler])

    return tasks
}

export function useAssignedTasksQueryPolling(
    userId,
    { first, skip } = { first: 50, skip: 0 }
) {
    const [tasks, setTasks] = useState(null)
    const { modelName } = useAppState()
    const model = models.find(m => m.name === modelName)

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
        useQuery(model.requests.tasksAssigned, {
            variables: {
                userId,
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

export function useTasksAcceptedByUserQueryPolling(
    userId,
    { first, skip } = { first: 50, skip: 0 }
) {
    // We had to change the logic from a fake subscription (aragon does this)
    // to a query that uses polling
    const [userTasks, setUserTasks] = useState([])
    const { modelName } = useAppState()
    const model = models.find(m => m.name === modelName)

    const onTasksForUserHandler = useCallback(data => {
        // console.log("[onTaskForUserHandler] Tasks: ");
        // console.log(tasks)
        // Adjust structure of obtained tasks
        const transformedTasks = data.tasks.map(t => transformTaskData(t))
        setUserTasks(transformedTasks)
    }, [])

    const onTasksForUserErrorHanlder = err => {
        console.log('[onTasksForUserErrorHandler] Error: ')
        console.log(err)
    }

    const tasksPolling = useRef(
        useQuery(model.requests.tasksAccepted, {
            variables: {
                userId: userId,
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
