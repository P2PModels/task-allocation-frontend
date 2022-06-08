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
    tasks(where: {
      statusInt_in: $statuses,
      assignee: $userId
    }, first: $first, skip: $skip) {
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

export const USER = gql`
  query User($id: String!) {
    user(id: $id) {
      id
      benefits
      available
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