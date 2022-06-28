import { toChecksumAddress, toHex } from 'web3-utils'

// Every byte consists of two hex values hence 32 * 2 = 64.
// And 0x + 64 = 66 values
export function toBytes32(text, totalLength = 66) {
    const hexText = toHex(text)
    const paddingSize = totalLength - hexText.length

    if (paddingSize <= 0) return hexText

    return hexText + Array(paddingSize).fill(0).join('')
}

/**
 * Shorten an Ethereum address. `charsLength` allows to change the number of
 * characters on both sides of the ellipsis.
 *
 * Examples:
 *   shortenAddress('0x19731977931271')    // 0x1973…1271
 *   shortenAddress('0x19731977931271', 2) // 0x19…71
 *   shortenAddress('0x197319')            // 0x197319 (already short enough)
 *
 * @param {string} address The address to shorten
 * @param {number} [charsLength=4] The number of characters to change on both sides of the ellipsis
 * @returns {string} The shortened address
 */
export function shortenAddress(address, charsLength = 4) {
    const prefixLength = 2 // "0x"
    if (!address) {
        return ''
    }
    if (address.length < charsLength * 2 + prefixLength) {
        return address
    }
    return (
        address.slice(0, charsLength + prefixLength) +
        '…' +
        address.slice(-charsLength)
    )
}

// Check address equality with checksums
export function addressesEqual(first, second) {
    first = first && toChecksumAddress(first)
    second = second && toChecksumAddress(second)
    return first === second
}

export function timestampToDate(timestamp) {
    return new Date(timestamp * 1000)
}

export { toHex, hexToUtf8 } from 'web3-utils'
