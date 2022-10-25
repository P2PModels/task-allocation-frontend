import { useCallback, useEffect, useRef, useState } from 'react'
import {
    transformTaskData,
    generateUserId,
} from '../helpers/data-transform-helpers'
import { useAppState } from '../contexts/AppState'
import { toBytes32 } from '../helpers/web3-helpers'
import { useQuery } from '@apollo/client'
import models from '../types/models'

const POLL_INTERVAL = 2000

export function useUsersQuery({ first, skip } = { first: 50, skip: 0 }) {
    const { modelName } = useAppState()
    const model = models.find(m => m.name === modelName)
    const { data, loading, error, refetch } = useQuery(model.requests.users, {
        variables: {
            first,
            skip,
        },
    })

    if (error) console.log(error)

    return { users: data ? data.users : null, refetch }
}

export function useUserQuery(userId) {
    const { modelName } = useAppState()
    const model = models.find(m => m.name === modelName)
    const { data, loading, error } = useQuery(model.requests.user, {
        variables: {
            id: userId,
        },
    })

    if (error) console.log(error)

    return data ? data.user : undefined
}

export function useTasksQueryPolling({ first, skip } = { first: 50, skip: 0 }) {
    const { modelName } = useAppState()
    const model = models.find(m => m.name === modelName)
    const { data, loading, error, refetch, stopPolling } = useQuery(
        model.requests.tasks,
        {
            variables: {
                first,
                skip,
            },
            pollInterval: POLL_INTERVAL,
            fetchPolicy: 'network-only',
        }
    )

    if (error) {
        stopPolling()
        console.log(error)
    }

    return { tasks: data ? data.tasks : undefined, refetch }
}

export function useAvailableTasksQueryPolling(
    userId,
    { first, skip } = { first: 50, skip: 0 }
) {
    const { modelName } = useAppState()
    const model = models.find(m => m.name === modelName)
    const { data, loading, error, stopPolling } = useQuery(
        model.requests.tasksAvailable,
        {
            variables: {
                userId,
                first,
                skip,
            },
            pollInterval: POLL_INTERVAL,
            fetchPolicy: 'network-only',
        }
    )

    if (error) {
        stopPolling()
        console.log(error)
    }

    return { contractTasks: data ? data.tasks : undefined, stopPolling }
}

export function useAssignedTasksQueryPolling(
    userId,
    { first, skip } = { first: 50, skip: 0 }
) {
    const { modelName } = useAppState()
    const model = models.find(m => m.name === modelName)
    const { data, loading, error, stopPolling } = useQuery(
        model.requests.tasksAssigned,
        {
            variables: {
                userId,
                first,
                skip,
            },
            pollInterval: POLL_INTERVAL,
            fetchPolicy: 'network-only',
        }
    )

    if (error) {
        stopPolling()
        console.log(error)
    }

    return data ? data.tasks : undefined
}

export function useTasksAcceptedByUserQueryPolling(
    userId,
    { first, skip } = { first: 50, skip: 0 }
) {
    // We had to change the logic from a fake subscription (aragon does this)
    // to a query that uses polling
    const { modelName } = useAppState()
    const model = models.find(m => m.name === modelName)
    const { data, loading, error, stopPolling } = useQuery(
        model.requests.tasksAccepted,
        {
            variables: {
                userId: userId,
                first,
                skip,
            },
            pollInterval: POLL_INTERVAL,
        }
    )

    if (error) {
        stopPolling()
        console.log(error)
    }

    // If accepted tasks exist stop polling since it won't update
    if (data && data.tasks.length > 0) {
        stopPolling()
    }

    return data ? data.tasks.map(t => transformTaskData(t)) : undefined
}
