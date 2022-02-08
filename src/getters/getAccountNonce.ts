import { NonceManager } from '@ethersproject/experimental'
import { MetaMaskInpageProvider } from '@metamask/providers'
import { Wallet } from 'ethers'

export default async function getAccountNonce(
    address: string,
    ethereumProvider: MetaMaskInpageProvider
): Promise<number> {
    const nonce = (await ethereumProvider.request({
        method: 'eth_getTransactionCount',
        params: [address],
    })) as string
    console.log('nonce', nonce)
    return parseInt(nonce)
}
