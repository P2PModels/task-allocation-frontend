import FCFS_CONTRACT from '../assets/abis/FCFSTAA'
import RR_CONTRACT_ABI from '../assets/abis/RoundRobinTAA'
import RR_CAL_CONTRACT_ABI from '../assets/abis/RoundRobinApp'
import {
    FCFS_USERS,
    FCFS_USER,
    FCFS_TASKS,
    FCFS_TASKS_AVAILABLE,
    FCFS_USER_TASKS_ACCEPTED,
    RR_USERS,
    RR_USER,
    RR_TASKS,
    RR_USER_TASKS_ASSIGNED,
    RR_USER_TASKS_ACCEPTED,
} from '../queries/queries'
const models = [
    {
        name: 'fcfs',
        displayName: 'First come first serve',
        description:
            'We are currently piloting a new way of distributing the tasks and therefore the value within our platform. Thank you for your collaboration! This model allocates the task to the first person to claim for it. Is the current model used in the oficial platform so it should be familiar. We use it as the reference to see the performance of the other models.',
        contractAddress: process.env.REACT_APP_RINKEBY_FCFS_CONTRACT_ADDRESS,
        contractAbi: FCFS_CONTRACT.abi,
        endpoint: process.env.REACT_APP_FCFS_SUBGRAPH_ENDPOINT,
        requests: {
            users: FCFS_USERS,
            user: FCFS_USER,
            tasks: FCFS_TASKS,
            tasksAvailable: FCFS_TASKS_AVAILABLE,
            tasksAccepted: FCFS_USER_TASKS_ACCEPTED,
        },
    },
    {
        name: 'rr',
        displayName: 'Round robin',
        description:
            'We are currently piloting a new way of distributing the tasks and therefore the value within our platform. Thank you for your collaboration! This model gets each incoming task and assigns it to the first user in a list. The user then is moved to the end of the list. The user can accept or reject the task. Then they will need to wait until a new task is assigned to they.',
        contractAddress: process.env.REACT_APP_RINKEBY_RR_CONTRACT_ADDRESS,
        contractAbi: RR_CONTRACT_ABI,
        endpoint: process.env.REACT_APP_RR_SUBGRAPH_ENDPOINT,
        requests: {
            users: RR_USERS,
            user: RR_USER,
            tasks: RR_TASKS,
            tasksAssigned: RR_USER_TASKS_ASSIGNED,
            tasksAccepted: RR_USER_TASKS_ACCEPTED,
        },
    },
    {
        name: 'rr-cal',
        displayName: 'Round robin with calendar',
        description: 'This model allocates...',
        contractAddress: process.env.REACT_APP_RINKEBY_RR_CAL_CONTRACT_ADDRESS,
        contractAbi: RR_CAL_CONTRACT_ABI,
        endpoint: process.env.REACT_APP_RR_CAL_SUBGRAPH_ENDPOINT,
    },
]

export default models
