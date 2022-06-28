import { gql } from '@apollo/client'

export const CONFIG = gql`
    query Config($id: String!) {
        config(id: $id) {
            id
            maxAllocatedTasks
        }
    }
`

export const USER_TASKS_BY_STATUS = gql`
    query Tasks($statuses: [Int]!, $userId: ID!, $first: Int!, $skip: Int!) {
        tasks(
            where: { statusInt_in: $statuses, assignee: $userId }
            first: $first
            skip: $skip
        ) {
            id
            endDate
            reallocationTime
            status
            assignee {
                id
            }
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
