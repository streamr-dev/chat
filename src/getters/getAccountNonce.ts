import { MetaMaskInpageProvider } from '@metamask/providers'

export default async function getAccountNonce(
    address: string,
    ethereumProvider: MetaMaskInpageProvider
): Promise<number> {
    const chainId = (await ethereumProvider.request({
        method: 'eth_chainId',
    })) as string

    if (parseInt(chainId) !== 137) {
        throw new Error('Not connected to Polygon network')
    }

    const nonce = (await ethereumProvider.request({
        method: 'eth_getTransactionCount',
        params: [address],
    })) as string
    return parseInt(nonce)
}
