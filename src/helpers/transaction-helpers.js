import { Actions } from '../actions-types'

const { AcceptTask, RejectTask } = Actions

export function getTxStatus(type) {
  switch (type) {
    case 'error':
      return 'Transaction failed'
    case 'success':
      return 'Transaction succeeded'
    default:
      return 'Transaction on execution'
  }
}

export function getTxAction(action) {
  switch (action) {
    case AcceptTask:
      return 'Assignment Accepted'
    case RejectTask:
      return 'Assignment Rejected'
    default:
      return 'Assignment Processed'
  }
}
