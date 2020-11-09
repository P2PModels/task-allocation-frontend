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

// Maps to typeInt number from subgraph, useful for queries
const intMapping = {
  [TaskStatuses.NonExistent]: 0,
  [TaskStatuses.Available]: 1,
  [TaskStatuses.Assigned]: 2,
  [TaskStatuses.Accepted]: 3,
  [TaskStatuses.Rejected]: 4,
  [TaskStatuses.Completed]: 5,
}

export function convertFromString(str) {
  return symbolMapping[str]
}

export function convertToString(symbol) {
  return stringMapping[symbol]
}

export function convertToInt(symbol) {
  return intMapping[symbol]
}
