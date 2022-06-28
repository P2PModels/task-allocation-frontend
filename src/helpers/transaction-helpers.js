import { Actions } from '../types/actions'

const { AcceptTask, RejectTask } = Actions

// export function getTxStatus(type, allocatedTasks) {
export function getTxStatus(type) {
    switch (type) {
        case 'error':
            return 'The transaction failed.'
        case 'success':
            // if (allocatedTasks > 0) {
            //   return 'The transaction succeeded. Tasks assigned to you were reassigned to other users during the transaction.'
            // } else {
            //   return 'The transaction succeeded.'
            // }
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
