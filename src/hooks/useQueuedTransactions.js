import { useState, useEffect, useRef } from 'react'
import useTransaction from './useTransaction'

export default function useQueuedTransactions() {
    const [txsHash, setTxsHash] = useState([])
    const [receipts, setReceipts] = useState([])
    const loading = useRef(false)
    const [error, setError] = useState([])

    const [providers, setProviders] = useState([])
    const [usePrivateKeys, setUsePrivateKeys] = useState([])
    const [txsToProcess, setTxsToProcess] = useState([])
    const currentTxIndex = useRef(null)
    const [preparingNextTx, setPreparingNextTx] = useState(false)
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
        // console.log(
        //     `%c[queueTransaction] Tx added to queue in position ${
        //         lastTxIndex.current
        //     }, ${
        //         usePrivateKey
        //             ? 'private key WILL be used'
        //             : 'private key WONT be used'
        //     }`,
        //     'color: orange'
        // )

        // If its the first time or the queue was completed
        if (!loading.current) {
            if (currentTxIndex.current == null) {
                currentTxIndex.current = 0
            }
            // console.log('%c[useQueueTransaction] Bootstraping', 'color: orange')
            loading.current = true
            setPreparingNextTx(true)
            // Bootstrap
            processTransaction(web3, inputTx, usePrivateKey)
            currentTxIndex.current++
        }

        setProviders(providers => [...providers, web3])
        setTxsToProcess(inputTxs => [...inputTxs, inputTx])
        setUsePrivateKeys(usePrivateKeys => [...usePrivateKeys, usePrivateKey])
        lastTxIndex.current++
    }

    const stop = () => {
        setTxsHash([])
        setReceipts([])
        loading.current = false
        setError([])
        currentTxIndex.current = null
        lastTxIndex.current = 0
        setProviders([])
        setTxsToProcess([])
        setUsePrivateKeys([])
        setPreparingNextTx(false)
    }

    useEffect(() => {
        if (currentError) {
            console.log(currentError)
            setError(error => [...error, currentError])
            return
        }
        if (currentLoading && currentTxHash) {
            // console.log(
            //     `%c[useQueuedTransactions] Processing tx ${currentTxHash.slice(
            //         0,
            //         5
            //     )}...${currentTxHash.slice(
            //         currentTxHash.length - 3,
            //         currentTxHash.length
            //     )}`,
            //     'color: orange'
            // )
            setTxsHash(txsHash => [...txsHash, currentTxHash])
            setPreparingNextTx(false)
            return
        }
        if (currentReceipt && !currentLoading && !preparingNextTx) {
            // console.log(
            //     `%c[useQueuedTransactions] Tx ${
            //         currentTxIndex.current //+ 1
            //     } processed: `,
            //     'color: orange'
            // )
            // console.log(currentReceipt)

            // Update state
            setReceipts(receipts => [...receipts, currentReceipt])
            setError(error => [...error, null])

            if (currentTxIndex.current < lastTxIndex.current) {
                setPreparingNextTx(true)
                // console.log(
                //     '%c[useQueueTransaction] Sending next tx...',
                //     'color: orange'
                // )
                processTransaction(
                    providers[currentTxIndex.current],
                    txsToProcess[currentTxIndex.current],
                    usePrivateKeys[currentTxIndex.current]
                )
                currentTxIndex.current++
            } else if (currentTxIndex.current == lastTxIndex.current) {
                // console.log(
                //     '%c[useQueueTransaction] Queue finished',
                //     'color: orange'
                // )
                loading.current = false
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
        { data: { txsHash, receipts }, loading: loading.current, error },
    ]
}
