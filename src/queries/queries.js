import { gql } from '@apollo/client'
import { TaskStatuses } from '../types/taskStatuses'

export const CONFIG = gql`
    query Config($id: String!) {
        config(id: $id) {
            id
            maxAllocatedTasks
        }
    }
`

export const USER_TASKS_ACCEPTED = gql`
    query Tasks($userId: ID!, $first: Int!, $skip: Int!) {
        tasks(
            where: { status: ACCEPTED, userId: $userId }
            first: $first
            skip: $skip
        ) {
            id
            # endDate
            # reallocationTime
            status
            userId
            # assignee {
            #     id
            # }
        }
    }
`

export const FCFS_TASKS_AVAILABLE = gql`
    query Tasks($first: Int!, $skip: Int!) {
        tasks(where: { status: AVAILABLE }, first: $first, skip: $skip) {
            id
            status
            userId
        }
    }
`

export const FCFS_TASKS = gql`
    query Tasks($first: Int!, $skip: Int!) {
        tasks(first: $first, skip: $skip) {
            id
            status
            userId
        }
    }
`

export const USER = gql`
    query User($id: String!) {
        user(id: $id) {
            id
            benefits
            available
        }
    }
`

export const FCFS_USERS = gql`
    query Users($first: Int!, $skip: Int!) {
        users(first: $first, skip: $skip) {
            id
            hasTask
        }
    }
`

export const FCFS_USER = gql`
    query FCFSUser($id: String!) {
        users(id: $id) {
            id
            hasTask
        }
    }
`

export const USER_REJECTED_TASKS = gql`
    query User($id: String!) {
        user(id: $id) {
            rejectedTasks {
                task {
                    id
                    endDate
                    reallocationTime
                    status
                }
            }
        }
    }
`
