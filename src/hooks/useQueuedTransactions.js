import React, { useState, useEffect, useRef } from 'react'
import ProvidersModal from '../components/Modals/ProvidersModal'
import useTransaction from './useTransaction'

export default function useQueuedTransactions() {
    const [txsHash, setTxsHash] = useState([])
    const [receipts, setReceipts] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState([])

    const [providers, setProviders] = useState([])
    const [usePrivateKeys, setUsePrivateKeys] = useState([])
    const [txsToProcess, setTxsToProcess] = useState([])
    const currentTxIndex = useRef(null)
    const [preparingNextTx, setPreparingNextTx] = useState(false)
    // const [lastTxIndex, setLastTxIndex] = useState(0)
    const lastTxIndex = useRef(0)

    let [
        processTransaction,
        {
            data: { txHash: currentTxHash, receipt: currentReceipt },
            loading: currentLoading,
            error: currentError,
        },
    ] = useTransaction()

    const queueTransaction = (web3, inputTx, usePrivateKey = false) => {
        console.log(
            `%c[queueTransaction] Tx added to queue in position ${lastTxIndex}, ${
                usePrivateKey
                    ? 'private key WILL be used'
                    : 'private key WONT be used'
            }`,
            'color: orange'
        )

        // If its the first time
        if (!loading && currentTxIndex.current == null) {
            console.log('%c[useQueueTransaction] Bootstraping', 'color: orange')
            setLoading(true)
            currentTxIndex.current = 0
            setPreparingNextTx(true)
            // Bootstrap
            processTransaction(web3, inputTx, usePrivateKey)
        }

        setProviders(providers => [...providers, web3])
        setTxsToProcess(inputTxs => [...inputTxs, inputTx])
        setUsePrivateKeys(usePrivateKeys => [...usePrivateKeys, usePrivateKey])
        // setLastTxIndex(lastTxIndex => lastTxIndex + 1)
        lastTxIndex.current++

        // return lastTxIndex.current
    }

    const stop = () => {
        setTxsHash([])
        setReceipts([])
        setLoading(false)
        setError([])
        currentTxIndex.current = null
        lastTxIndex.current = 0
        setProviders([])
        setTxsToProcess([])
        setUsePrivateKeys([])
        setPreparingNextTx(false)
    }

    useEffect(() => {
        console.log('%c[useQueuedTransactions] useEffect', 'color: orange')
        if (currentError) {
            console.log('%c[useQueueTransaction] Error: ', 'color: orange')
            console.log(currentError)
            setError(error => [...error, currentError])
            return
        }
        if (currentLoading && currentTxHash) {
            console.log(
                `%c[useQueuedTransactions] Processing tx ${currentTxHash}...`,
                'color: orange'
            )
            setTxsHash(txsHash => [...txsHash, currentTxHash])
            setPreparingNextTx(false)
            return
        }
        if (currentReceipt && !currentLoading && !preparingNextTx) {
            console.log(
                `%c[useQueuedTransactions] Tx ${
                    currentTxIndex.current + 1
                } processed: `,
                'color: orange'
            )
            console.log(currentReceipt)

            // Update state
            setReceipts(receipts => [...receipts, currentReceipt])
            setError(error => [...error, null])
            setPreparingNextTx(true)

            if (currentTxIndex.current + 1 < lastTxIndex.current) {
                console.log(
                    '%c[useQueueTransaction] Sending next tx...',
                    'color: orange'
                )
                processTransaction(
                    providers[currentTxIndex.current + 1],
                    txsToProcess[currentTxIndex.current + 1],
                    usePrivateKeys[currentTxIndex.current + 1]
                )
                currentTxIndex.current++
            } else if (currentTxIndex.current + 1 == lastTxIndex.current) {
                // Bulk report finished
                setLoading(false)
            }
            return
        }
    }, [
        currentTxHash,
        currentReceipt,
        currentLoading,
        currentError,
        txsToProcess,
    ])

    return [
        queueTransaction,
        stop,
        { data: { txsHash, receipts }, loading, error },
    ]
}
