import { MetaMaskInpageProvider } from '@metamask/providers'
import { useCallback } from 'react'
import { useStore } from '../components/Store'
import getEnvironmentConfig from '../getters/getEnvironmentConfig'
/*
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
}*/

export const requestNetworkChange = async (
    ethereumProvider: MetaMaskInpageProvider
) => {
    const {PolygonNetworkInfo} = getEnvironmentConfig()
    if (
        ethereumProvider.networkVersion !==
        PolygonNetworkInfo.chainId.toString()
    ) {
        alert(
            `Looks like you are not connected to the ${PolygonNetworkInfo.name} Network. Approve your switch on Metamask`
        )
        try {
            const requestSwitch = await ethereumProvider.request({
                method: 'wallet_switchEthereumChain',
                params: [
                    {
                        chainId: PolygonNetworkInfo.chainIdHex,
                    },
                ],
            })
            alert('Successfully connected to Polygon Network')
            return requestSwitch
        } catch (err: any) {
            console.warn('01', err)
            if (err.code === 4902) {
                console.log('requesting add')
                try {
                    // takes in more parameters, see https://docs.metamask.io/guide/rpc-api.html#unrestricted-methods
                    const requestAdd = await ethereumProvider.request({
                        method: 'wallet_addEthereumChain',
                        params: [
                            {
                                chainId: PolygonNetworkInfo.chainIdHex,
                                chainName: PolygonNetworkInfo.name,
                                rpcUrls: [PolygonNetworkInfo.rpcUrl],
                                blockExplorerUrls: [
                                    PolygonNetworkInfo.blockExplorer,
                                ],
                                nativeCurrency: {
                                    decimals: PolygonNetworkInfo.decimals,
                                    name: PolygonNetworkInfo.symbol,
                                    symbol: PolygonNetworkInfo.symbol,
                                },
                            },
                        ],
                    })
                    alert('Successfully connected to Polygon Network')
                    return requestAdd
                } catch (err: any) {
                    console.warn('02', err)
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

export default function useEnsureCorrectNetwork() {
    const { ethereumProvider } = useStore()

    return useCallback(async () => {
        if (!ethereumProvider) {
            return
        }
        await requestNetworkChange(ethereumProvider)
    }, [ethereumProvider])
}
