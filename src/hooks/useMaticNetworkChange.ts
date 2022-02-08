import { useCallback } from 'react'
import { useStore } from '../components/Store'

const MaticNetwork = {
    id: 137,
    name: 'MATIC',
    symbol: 'MATIC',
    rpcUrl: 'https://polygon-rpc.com/',
    blockExplorerUrl: 'https://polygonscan.com/',
}

export default function useMaticNetworkChange(): () => Promise<void> {
    const { ethereumProvider } = useStore()
    return useCallback(async () => {
        if (!ethereumProvider) {
            throw new Error('No ethereum provider detected')
        }
        const chainId = (await ethereumProvider.request({
            method: 'eth_chainId',
        })) as string

        const shouldRequestChange = parseInt(chainId) !== MaticNetwork.id

        if (shouldRequestChange) {
            try {
                await ethereumProvider.request({
                    method: 'wallet_switchEthereumChain',
                    params: [
                        {
                            chainId: `0x${MaticNetwork.id.toString(16)}`,
                        },
                    ],
                })
            } catch (err: any) {
                if (err.code === 4902) {
                    try {
                        await ethereumProvider.request({
                            method: 'wallet_addEthereumChain',
                            params: [
                                {
                                    chainId: `0x${MaticNetwork.id.toString(
                                        16
                                    )}`,
                                    chainName: MaticNetwork.name,
                                    rpcUrls: [MaticNetwork.rpcUrl],
                                    blockExplorerUrls: [
                                        MaticNetwork.blockExplorerUrl,
                                    ],
                                    nativeCurrency: MaticNetwork.symbol,
                                },
                            ],
                        })
                    } catch (err: any) {
                        if (err.code === 4001 || err.code === 4902)
                            alert('chainIdRejected')
                        throw err
                    }
                }
                if (err.code === 4001 || err.code === 4902)
                    alert('chainIdRejected')
                throw err
            }
        }
        return
    }, [ethereumProvider])
}
