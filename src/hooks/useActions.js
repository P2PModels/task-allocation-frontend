import { useCallback } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useAppState } from '../contexts/AppState'
import { getAppByName } from '../helpers/app-connector-helpers'
import { Actions } from '../actions-types'
import { toBytes32 } from '../helpers/web3-helpers'

const APP_NAME = process.env.REACT_APP_TASK_ALLOCATION_APP_NAME
const PRIVATE_KEY = process.env.REACT_APP_SERVER_ACCOUNT_PRIVATE_KEY
const GAS_LIMIT = 450000
const { AcceptTask, RejectTask } = Actions

function useActions(onReportStatus) {
  const { account, library: web3 } = useWeb3React()
  const { installedApps, organization } = useAppState()
  const app = getAppByName(installedApps, APP_NAME)

  const reallocateTask = useCallback(
    taskId => {
      const hexTaskId = toBytes32(taskId)
      sendIntent(
        organization,
        app.address,
        'reallocateTask',
        [hexTaskId],
        {
          web3,
          from: account,
        },
        type => {
          console.log(`reallocateTask Tx status: ${type}`)
        },
        true
      )
    },
    [organization, app, web3, account]
  )
  /**
   * Function that is triggered when a user
   * confirms a transaction to acept a task
   */
  const acceptTask = useCallback(
    (userId, taskId) => {
      const hexUserId = toBytes32(userId)
      const hexTaskId = toBytes32(taskId)
      // Send transaction
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
    reallocateTask,
    acceptTask,
    rejectTask,
  }
}

/**
 * In Aragon Connect we need to send an
 * intent which returns all transactions
 * that need to be executed to acomplish
 * current transaction.
 * 
 * It might be the case that a transaction
 * needs to execute an additional transaction
 * (voting) to complete its execution 
 */
async function sendIntent(
  org,
  appAddress,
  fn,
  params,
  { web3, from },
  onReportStatus,
  usePrivateKey = false
) {
  try {
    // Create intent for the application appAddress of the
    // dao org
    const intent = org.appIntent(appAddress, fn, params)
    // Get transactions from intent
    const [tx] = await intent.transactions(from)
    // Data contains the function to be call in the contract
    // To contains the address of the contract
    const { data, to } = tx

    processTransaction(
      web3,
      { from, to, data, gas: GAS_LIMIT },
      txHash => onReportStatus('info'),
      receipt => onReportStatus('success'),
      err => {
        console.error(err)
        onReportStatus('error')
      },
      usePrivateKey
    )
  } catch (err) {
    console.error('Could not create tx:', err)
    onReportStatus('error')
  }
}

async function processTransaction(
  web3,
  tx,
  onSigned,
  onConfirmed,
  onError,
  usePrivateKey
) {
  if (usePrivateKey) {
    const { rawTransaction } = await web3.eth.accounts.signTransaction(
      tx,
      PRIVATE_KEY
    )
    web3.eth
      .sendSignedTransaction(rawTransaction)
      .on('transactionHash', txHash => onSigned(txHash))
      .on('receipt', receipt => onConfirmed(receipt))
      .on('error', err => onError(err))
  } else {
    web3.eth
      .sendTransaction(tx)
      .on('transactionHash', txHash => onSigned(txHash))
      .on('receipt', receipt => onConfirmed(receipt))
      .on('error', err => onError(err))
  }
}

export default useActions
