import { Actions } from '../actions-types'

const { AcceptTask, RejectTask } = Actions

export function getTxStatus(type) {
  switch (type) {
    case 'error':
      return 'The transaction failed.'
    case 'success':
      return 'The transaction succeeded.'
    default:
      return "The transaction was sent. Wait until it's accepted. "
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
