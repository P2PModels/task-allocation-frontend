import { useCallback, useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useAppState } from '../contexts/AppState'
import { Actions } from '../types/actions'
import { toBytes32 } from '../helpers/web3-helpers'
import useTransaction from './useTransaction'

// const GAS_LIMIT = 450000
const GAS_PRICE = 2000000000
const { AcceptTask } = Actions

function useActions(onReportStatus) {
    const { account, library: web3 } = useWeb3React()
    const { contractAddress, modelContractInstance } = useAppState()
    const [
        processTransaction,
        {
            data: { txHash, receipt: txReceipt },
            loading: txLoading,
            error: txError,
        },
    ] = useTransaction()
    const [currentAction, setCurrentAction] = useState()

    useEffect(() => {
        if (txHash && !txLoading && !txReceipt && !txError) {
            onReportStatus('info', currentAction)
        } else if (txHash && txLoading && !txError) {
        } else if (txHash && !txLoading && txReceipt && !txError) {
            onReportStatus('success', currentAction)
            setCurrentAction(null)
        } else if (txError) {
            console.error(txError)
            onReportStatus('error', currentAction)
        }
    }, [txHash, txReceipt, txLoading, txError])

    /**
     * Function that is triggered when a user
     * confirms a transaction to acept a task
     */
    const acceptTask = useCallback(
        (userId, taskId) => {
            const hexUserId = toBytes32(userId)
            const hexTaskId = toBytes32(taskId)

            // console.log('[AcceptTask] params:')
            // console.log(hexUserId)
            // console.log(hexTaskId)

            const acceptTaskTxParams = {
                from: account,
                to: contractAddress,
                data: modelContractInstance.methods['acceptTask'](
                    hexUserId,
                    hexTaskId
                ).encodeABI(),
                // gas: GAS_LIMIT,
                gasPrice: GAS_PRICE,
            }

            try {
                processTransaction(web3, acceptTaskTxParams, false)
                setCurrentAction(AcceptTask)
            } catch (err) {
                console.error('Could not create tx:', err)
                onReportStatus('error', AcceptTask)
            }
        },
        [web3, account, onReportStatus]
    )

    return {
        acceptTask,
    }
}

export default useActions
