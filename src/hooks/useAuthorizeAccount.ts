import { useCallback } from 'react'
import { ActionType, useDispatch, useStore } from '../components/Store'
import { Contract, providers } from 'ethers'
import getEnvironmentConfig from '../getters/getEnvironmentConfig'
import * as DelegatedAccessRegistryArtifact from '../artifacts/DelegatedAccessRegistry.json'

const DelegatedAccessRegistryAbi = DelegatedAccessRegistryArtifact as any
export default function useAuthorizeAccount(): (
    delegatedAddress: string
) => Promise<void> {
    const { ethereumProvider } = useStore()
    const { DelegatedAccessRegistryAddress } = getEnvironmentConfig()
    const dispatch = useDispatch()

    return useCallback(
        async (delegatedAddress: string) => {
            if (!ethereumProvider) {
                return
            }

            const contract = new Contract(
                DelegatedAccessRegistryAddress,
                DelegatedAccessRegistryAbi.abi,
                new providers.Web3Provider(ethereumProvider as any).getSigner()
            )

            const [isAuthorized] = await contract.functions.isUserAuthorized(
                ethereumProvider.selectedAddress,
                delegatedAddress
            )

            if (!isAuthorized) {
                const tx = await contract.functions.authorize(delegatedAddress)
                console.log('useAuthorizeAccount tx', tx)
                await tx.wait()
                console.log(
                    'added session wallet',
                    delegatedAddress,
                    'as delegated to metamask account',
                    ethereumProvider.selectedAddress
                )
            }
        },
        [ethereumProvider, dispatch]
    )
}
