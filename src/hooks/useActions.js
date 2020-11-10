import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useAppState } from '../contexts/AppState'
import { getAppByName } from '../helpers/app-connector-helpers'
import { Actions } from '../actions-types'
import { toBytes32 } from '../helpers/web3-utils'

const APP_NAME = process.env.REACT_APP_TASK_ALLOCATION_APP_NAME
const GAS_LIMIT = 450000
const { AcceptTask, RejectTask } = Actions

function useActions(onReportStatus) {
  const { account, library: web3 } = useWeb3React()
  const { installedApps, organization } = useAppState()
  const app = getAppByName(installedApps, APP_NAME)

  const acceptTask = useCallback(
    (userId, taskId) => {
      const hexUserId = toBytes32(userId)
      const hexTaskId = toBytes32(taskId)

      sendIntent(
        organization,
        app.address,
        'acceptTask',
        [hexUserId, hexTaskId],
        {
          web3,
          from: account,
        },
        type => onReportStatus(type, AcceptTask)
      )
    },
    [organization, app, web3, account, onReportStatus]
  )

  const rejectTask = useCallback(
    (userId, taskId) => {
      const hexUserId = toBytes32(userId)
      const hexTaskId = toBytes32(taskId)

      sendIntent(
        organization,
        app.address,
        'rejectTask',
        [hexUserId, hexTaskId],
        {
          web3,
          from: account,
        },
        type => onReportStatus(type, RejectTask)
      )
    },
    [organization, app, web3, account, onReportStatus]
  )

  return {
    acceptTask,
    rejectTask,
  }
}

async function sendIntent(
  org,
  appAddress,
  fn,
  params,
  { web3, from },
  onReportStatus
) {
  try {
    const intent = org.appIntent(appAddress, fn, params)
    console.log(intent)
    const [tx] = await intent.transactions(from)
    const { data, to } = tx
    console.log(from)

    processTransaction(
      web3,
      { from, to, data, gas: GAS_LIMIT },
      txHash => onReportStatus('info'),
      receipt => onReportStatus('success'),
      err => {
        console.error(err)
        onReportStatus('error')
      }
    )
    // web3.eth
    //   .sendTransaction({
    //     from,
    //     to,
    //     data,
    //     gas: GAS_LIMIT,
    //   })
    //   .then(res => {
    //     console.log('Tx received: ')
    //     console.log(res)
    //     onReportStatus('success')
    //   })
    //   .catch(err => {
    //     console.error('Could not create tx:', err)
    //     onReportStatus('error')
    //   })
  } catch (err) {
    console.error('Could not create tx:', err)
    onReportStatus('error')
  }
}

function processTransaction(web3, tx, onSigned, onConfirmed, onError) {
  web3.eth
    .sendTransaction(tx)
    .on('transactionHash', txHash => onSigned(txHash))
    .on('receipt', receipt => onConfirmed(receipt))
    .on('error', err => onError(err))
}

export default useActions
