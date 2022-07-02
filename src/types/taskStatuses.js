export const TaskStatuses = {
  NonExistent: Symbol('NON_EXISTENT'),
  Available: Symbol('AVAILABLE'),
  // Assigned: Symbol('ASSIGNED'),
  Accepted: Symbol('ACCEPTED'),
  // Rejected: Symbol('REJECTED'),
  Completed: Symbol('COMPLETED'),
}

const symbolMapping = {
  NonExistent: TaskStatuses.NonExistent,
  Available: TaskStatuses.Available,
  // Assigned: TaskStatuses.Assigned,
  Accepted: TaskStatuses.Accepted,
  // Rejected: TaskStatuses.Rejected,
  Completed: TaskStatuses.Completed,
}

const stringMapping = {
  [TaskStatuses.NonExistent]: 'NonExistent',
  [TaskStatuses.Available]: 'Available',
  // [TaskStatuses.Assigned]: 'Assigned',
  [TaskStatuses.Accepted]: 'Accepted',
  // [TaskStatuses.Rejected]: 'Rejected',
  [TaskStatuses.Completed]: 'Completed',
}

// Maps to typeInt number from subgraph, useful for queries
const intMapping = {
  [TaskStatuses.NonExistent]: 0,
  [TaskStatuses.Available]: 1,
  // [TaskStatuses.Assigned]: 2,
  [TaskStatuses.Accepted]: 2,
  // [TaskStatuses.Rejected]: 4,
  [TaskStatuses.Completed]: 3,
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
