export const Actions = {
  AcceptTask: Symbol('ACCEPT_TASK_ACTION'),
  RejectTask: Symbol('REJECT_TASK_ACTION'),
}

const symbolMapping = {
  Accept: Actions.AcceptTask,
  Reject: Actions.RejectTask,
}

const stringMapping = {
  [Actions.AcceptTask]: 'acceptTask',
  [Actions.RejectTask]: 'rejectTask',
}

export function convertFromString(str) {
  return symbolMapping[str]
}

export function convertToString(symbol) {
  return stringMapping[symbol]
}
