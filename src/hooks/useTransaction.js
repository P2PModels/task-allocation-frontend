import { useState } from 'react'
const PRIVATE_KEY = process.env.REACT_APP_AMARA_PRIVATE_KEY

const useTransaction = () => {
    const [txHash, setTxHash] = useState()
    const [receipt, setReceipt] = useState()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState()

    async function processTransaction(web3, tx, usePrivateKey = false) {
        console.log('Sending transaction!')
        // console.log(tx)
        if (usePrivateKey) {
            const { rawTransaction } = await web3.eth.accounts.signTransaction(
                tx,
                PRIVATE_KEY
            )
            web3.eth
                .sendSignedTransaction(rawTransaction)
                .on('transactionHash', hash => {
                    setTxHash(hash)
                    setLoading(true)
                })
                .on('receipt', r => {
                    setReceipt(r)
                    setLoading(false)
                })
                .on('error', err => {
                    setError(err)
                    setLoading(false)
                })
        } else {
            web3.eth
                .sendTransaction(tx)
                .on('transactionHash', hash => {
                    setTxHash(hash)
                    setLoading(true)
                })
                .on('receipt', r => {
                    setReceipt(r)
                    setLoading(false)
                })
                .on('error', err => {
                    setError(err)
                    setLoading(false)
                })
        }
    }

    return [
        processTransaction,
        {
            data: {
                txHash,
                receipt,
            },
            loading,
            error,
        },
    ]
}

export default useTransaction
