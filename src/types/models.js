import FCFS_CONTRACT from '../assets/abis/FCFSTAA'
import RR_CONTRACT_ABI from '../assets/abis/RoundRobinApp'
import RR_CAL_CONTRACT_ABI from '../assets/abis/RoundRobinApp'

const models = [
    {
        name: 'fcfs',
        displayName: 'First come first serve',
        description:
            'This model allocates the task to the firs person to claim for it. Is the current model used in the oficial platform.',
        contractAddress: process.env.REACT_APP_RINKEBY_FCFS_CONTRACT_ADDRESS,
        contractAbi: FCFS_CONTRACT.abi,
        endpoint: process.env.REACT_APP_FCFS_SUBGRAPH_ENDPOINT,
        // TODO: add actions to models ¿?
        // actions: [
        //     {
        //         name: 'restart',
        //         displayName: 'Restart contract',
        //         icon: 'ReplayIcon',
        //         handler: 'restart'
        //     },
        //     {},
        //     {}
        // ]
    },
    {
        name: 'rr',
        displayName: 'Round robin',
        description: 'This model allocates...',
        contractAddress: process.env.REACT_APP_RINKEBY_RR_CONTRACT_ADDRESS,
        contractAbi: RR_CONTRACT_ABI,
        endpoint: process.env.REACT_APP_RR_SUBGRAPH_ENDPOINT,
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
