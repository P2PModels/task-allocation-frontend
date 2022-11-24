export const Actions = {
    Restart: Symbol('RESTART_ACTION'),
    RegisterUser: Symbol('REGISTER_USER_ACTION'),
    CreateTask: Symbol('CREATE_TASK_ACTION'),
    AcceptTask: Symbol('ACCEPT_TASK_ACTION'),
    RejectTask: Symbol('REJECT_TASK_ACTION'),
    SetUserCalendarRanges: Symbol('SET_USER_CALENDAR_RANGES_ACTION'),
}

const symbolMapping = {
    Restart: Actions.Restart,
    RegisterUser: Actions.RegisterUser,
    CreateTask: Actions.CreateTask,
    Accept: Actions.AcceptTask,
    Reject: Actions.RejectTask,
    SetCalendarRanges: Actions.SetUserCalendarRanges,
}

const stringMapping = {
    [Actions.Restart]: 'restart',
    [Actions.RegisterUser]: 'registerUser',
    [Actions.CreateTask]: 'createTask',
    [Actions.AcceptTask]: 'acceptTask',
    [Actions.RejectTask]: 'rejectTask',
    [Actions.SetUserCalendarRanges]: 'setUserCalendarRanges',
}

export function convertFromString(str) {
    return symbolMapping[str]
}

export function convertToString(symbol) {
    return stringMapping[symbol]
}
