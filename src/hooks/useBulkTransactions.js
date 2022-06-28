import React, { useState, useEffect } from 'react'
import useTransaction from './useTransaction'

export default function useBulkTransactions() {
    const [txsHash, setTxsHash] = useState([])
    const [receipts, setReceipts] = useState([])
    const [loading, setLoading] = useState()
    const [error, setError] = useState([])

    const [web3, setWeb3] = useState()
    const [usePrivateKey, setUsePrivateKey] = useState()
    const [txsToProcess, setTxsToProcess] = useState()
    const [currentTxIndex, setCurrentTxIndex] = useState()
    const [preparingNextTx, setPreparingNextTx] = useState(false)
    const [lastTxIndex, setLastTxIndex] = useState()
    let [
        processTransaction,
        {
            data: { txHash: currentTxHash, receipt: currentReceipt },
            loading: currentLoading,
            error: currentError,
        },
    ] = useTransaction()

    const processBulkTransactions = (web3, inputTxs, usePrivateKey = false) => {
        // console.log("[useBulkTransaction] Starting bulk txs process...")

        setWeb3(web3)
        setUsePrivateKey(usePrivateKey)

        // Bulk tx starts, set loading state
        setLoading(true)
        // Restart index
        setCurrentTxIndex(0)
        // Set last index
        setLastTxIndex(inputTxs.length)
        // Store cases to tx
        setTxsToProcess(inputTxs)

        // Bootstrap, tx first case
        processTransaction(web3, inputTxs[0], usePrivateKey)
    }

    useEffect(() => {
        // console.log('[useBulkTransactions] currentTxHash:')
        // console.log(currentTxHash)
        // console.log('[useBulkTransactions] currentReceipt:')
        // console.log(currentReceipt)
        // console.log('[useBulkTransactions] currentLoading:')
        // console.log(currentLoading)
        // console.log('[useBulkTransactions] currentError:')
        // console.log(currentError)

        if (currentError) {
            console.log('[useBulkTransaction] Error: ')
            console.log(currentError)
            setError(error => [...error, currentError])
            return
        }
        if (currentLoading && currentTxHash) {
            console.log(
                `[useBulkTransaction] Processing tx ${currentTxHash}...`
            )
            setTxsHash(txsHash => [...txsHash, currentTxHash])
            setPreparingNextTx(false)
            return
        }
        if (currentReceipt && !currentLoading && !preparingNextTx) {
            console.log(
                `[useBulkTransaction] Tx ${currentTxIndex + 1} processed: `
            )
            console.log(currentReceipt)

            // Update state
            setReceipts(receipts => [...receipts, currentReceipt])
            setError(error => [...error, null])
            setPreparingNextTx(true)

            if (currentTxIndex + 1 < lastTxIndex) {
                // console.log("[useBulkTransaction] Reporting next case...")
                processTransaction(
                    web3,
                    txsToProcess[currentTxIndex + 1],
                    usePrivateKey
                )
                setCurrentTxIndex(index => index + 1)
            } else if (currentTxIndex + 1 == lastTxIndex) {
                // Bulk report finished
                setLoading(false)
            }
            return
        }
    }, [currentTxHash, currentReceipt, currentLoading, currentError])

    return [
        processBulkTransactions,
        { data: { txsHash, receipts }, loading, error },
    ]
}
