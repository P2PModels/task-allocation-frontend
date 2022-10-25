import { gql } from '@apollo/client'

/**
 * Get all users
 *
 * @param  {Int!} $first
 * @param  {Int!} $skip
 */
export const FCFS_USERS = gql`
    query Users($first: Int!, $skip: Int!) {
        users(first: $first, skip: $skip) {
            id
            hasTask
        }
    }
`

/**
 * Get user by id
 *
 * @param  {String!} $id
 */
export const FCFS_USER = gql`
    query FCFSUser($id: String!) {
        users(id: $id) {
            id
            hasTask
        }
    }
`

/**
 * Get all tasks
 *
 * @param  {Int!} $first
 * @param  {Int!} $skip
 */
export const FCFS_TASKS = gql`
    query Tasks($first: Int!, $skip: Int!) {
        tasks(first: $first, skip: $skip) {
            id
            status
            userId
        }
    }
`
/**
 * Get all available tasks
 *
 * @param  {Int!} $first
 * @param  {Int!} $skip
 */
export const FCFS_TASKS_AVAILABLE = gql`
    query Tasks($first: Int!, $skip: Int!) {
        tasks(where: { status: Available }, first: $first, skip: $skip) {
            id
            status
            userId
        }
    }
`
/**
 * Get tasks accepted by the user, currently only one
 * task at a time can be accepted
 *
 * @param  {ID!} $userId
 * @param  {Int!} $first
 * @param  {Int!} $skip
 */
export const FCFS_USER_TASKS_ACCEPTED = gql`
    query Tasks($userId: ID!, $first: Int!, $skip: Int!) {
        tasks(
            where: { status: Accepted, userId: $userId }
            first: $first
            skip: $skip
        ) {
            id
            status
            userId
        }
    }
`

/**
 * Get all users
 *
 * @param  {Int!} $first
 * @param  {Int!} $skip
 */
export const RR_USERS = gql`
    query Users($first: Int!, $skip: Int!) {
        users(first: $first, skip: $skip) {
            id
            benefits
            available
            # rejectedTasks {
            #     id
            # }
        }
    }
`
/**
 * Get user by id
 *
 * @param  {String!} $id
 */
export const RR_USER = gql`
    query RRUser($id: String!) {
        user(id: $id) {
            id
            benefits
            available
            # rejectedTasks {
            #     id
            # }
        }
    }
`

/**
 * Get user calendar ranges
 *
 * @param  {String!} $id
 */
export const RR_CAL_USER = gql`
    query RRCalUser($id: String!) {
        user(id: $id) {
            id
            benefits
            available
            calendarRangesStart
            calendarRangesEnd
        }
    }
`

/**
 * Get all tasks
 *
 * @param  {Int!} $first
 * @param  {Int!} $skip
 */
export const RR_TASKS = gql`
    query Tasks($first: Int!, $skip: Int!) {
        tasks(first: $first, skip: $skip) {
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
/**
 * Get all tasks assigned to a user
 *
 * @param  {ID!} $userId
 * @param  {Int!} $first
 * @param  {Int!} $skip
 */
export const RR_USER_TASKS_ASSIGNED = gql`
    query Tasks($userId: ID!, $first: Int!, $skip: Int!) {
        tasks(
            where: { status: Assigned, assignee: $userId }
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
/**
 * Get all tasks accepted by the user, currently only one
 * task at a time can be accepted
 *
 * @param  {ID!} $userId
 * @param  {Int!} $first
 * @param  {Int!} $skip
 */
export const RR_USER_TASKS_ACCEPTED = gql`
    query Tasks($userId: ID!, $first: Int!, $skip: Int!) {
        tasks(
            where: { status: Accepted, assignee: $userId }
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

// Legacy
export const USER = gql`
    query User($id: String!) {
        user(id: $id) {
            id
            benefits
            available
        }
    }
`
// Legacy
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
