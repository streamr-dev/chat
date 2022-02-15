import { MetaMaskInpageProvider } from '@metamask/providers'
import { useCallback } from 'react'
import { useStore } from '../components/Store'

const PolygonChainId = 137
const PUBLIC_INFURA_PROJECT_ID = ''

const PolygonNetworkInfo = {
    chainId: PolygonChainId,
    chainIdHex: `0x${PolygonChainId.toString(16)}`,
    name: 'Polygon Mainnet',
    endpoint: `https://polygon-mainnet.infura.io/v3/${PUBLIC_INFURA_PROJECT_ID}`,
    blockExplorer: 'https://polygonscan.com/',
    rpcUrl: 'https://polygon-rpc.com/',
    decimals: 18,
    symbol: 'MATIC',
}

export const requestNetworkChange = async (
    ethereumProvider: MetaMaskInpageProvider
) => {
    const chainId = PolygonNetworkInfo.chainId
    const shouldRequestChange =
        ethereumProvider.networkVersion !== PolygonNetworkInfo.chainIdHex

    if (shouldRequestChange) {
        alert(
            'Looks like you are not connected to the Polygon Network. Approve your switch on Metamask'
        )
        try {
            const requestSwitch = await requestSwitchNetwork(
                chainId,
                ethereumProvider
            )
            alert('Successfully connected to Polygon Network')
            return requestSwitch
        } catch (err: any) {
            if (err.code === 4902) {
                try {
                    const requestAdd = await requestAddNetwork(
                        chainId,
                        ethereumProvider
                    )
                    alert('Successfully connected to Polygon Network')
                    return requestAdd
                } catch (err: any) {
                    if (err.code === 4001 || err.code === 4902) {
                        throw new Error('chainIdRejected')
                    }
                    throw err
                }
            }
            if (err.code === 4001 || err.code === 4902) {
                throw new Error('chainIdRejected')
            }
            throw err
        }
    }
}

const requestSwitchNetwork = async (
    chainIdHex: number,
    ethereumProvider: MetaMaskInpageProvider
) => {
    return await ethereumProvider.request({
        method: 'wallet_switchEthereumChain',
        params: [
            {
                chainId: `0x${chainIdHex.toString(16)}`,
            },
        ],
    })
}

interface AddEthereumChainParameter {
    chainId: string
    chainName: string
    nativeCurrency: {
        name: string
        symbol: string
        decimals: number
    }
    rpcUrls: string[]
    blockExplorerUrls?: string[]
    iconUrls?: string[]
}

const requestAddNetwork = async (
    chainId: number,
    ethereumProvider: MetaMaskInpageProvider
): Promise<string> => {
    const params: AddEthereumChainParameter = {
        chainId: `0x${chainId.toString(16)}`,
        chainName: PolygonNetworkInfo.name,
        rpcUrls: [PolygonNetworkInfo.rpcUrl],
        blockExplorerUrls: [PolygonNetworkInfo.blockExplorer],
        nativeCurrency: {
            decimals: PolygonNetworkInfo.decimals,
            name: PolygonNetworkInfo.symbol,
            symbol: PolygonNetworkInfo.symbol,
        },
    }
    return (await ethereumProvider.request({
        method: 'wallet_addEthereumChain',
        params: [params],
    })) as string
}

export default function usePolygonNetwork() {
    const { ethereumProvider } = useStore()

    return useCallback(async () => {
        if (!ethereumProvider) {
            return
        }
        await requestNetworkChange(ethereumProvider)
    }, [ethereumProvider])
}
