export const TaskStatuses = {
  NonExistent: Symbol('TASK_STATUS_NONEXISTEN'),
  Available: Symbol('TASK_STATUS_AVAILABLE'),
  Assigned: Symbol('TASK_STATUS_ASSIGNED'),
  Accepted: Symbol('TASK_STATUS_ACCEPTED'),
  Rejected: Symbol('TASK_STATUS_REJECTED'),
  Completed: Symbol('TASK_STATUS_COMPLETED'),
}

const symbolMapping = {
  NonExistent: TaskStatuses.NonExistent,
  Available: TaskStatuses.Available,
  Assigned: TaskStatuses.Assigned,
  Accepted: TaskStatuses.Accepted,
  Rejected: TaskStatuses.Rejected,
  Completed: TaskStatuses.Completed,
}

const stringMapping = {
  [TaskStatuses.NonExistent]: 'NonExistent',
  [TaskStatuses.Available]: 'Available',
  [TaskStatuses.Assigned]: 'Assigned',
  [TaskStatuses.Accepted]: 'Accepted',
  [TaskStatuses.Rejected]: 'Rejected',
  [TaskStatuses.Completed]: 'Completed',
}

export function convertFromString(str) {
  return symbolMapping[str]
}

export function convertToString(symbol) {
  return stringMapping[symbol]
}
