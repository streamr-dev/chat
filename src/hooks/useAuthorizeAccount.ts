import { useCallback } from 'react'
import { ActionType, useDispatch, useStore } from '../components/Store'
import { Contract, providers } from 'ethers'
import getEnvironmentConfig from '../getters/getEnvironmentConfig'
import * as DelegatedAccessRegistryArtifact from '../artifacts/DelegatedAccessRegistry.json'

const DelegatedAccessRegistryAbi = (DelegatedAccessRegistryArtifact as any)
export default function useAuthorizeAccount(): (delegatedAddress: string) => Promise<void> {
    const { ethereumProvider } = useStore()
    const { DelegatedAccessRegistryAddress } = getEnvironmentConfig()
    const dispatch = useDispatch()
    

    return useCallback(async (delegatedAddress: string) => {
        if (!ethereumProvider) {
            return
        }

        const contract = new Contract(
            DelegatedAccessRegistryAddress,
            DelegatedAccessRegistryAbi.abi,
            new providers.Web3Provider(ethereumProvider as any)
        )
        console.log('useAuthorizeAccount contract', contract)
            console.info(ethereumProvider.selectedAddress,  delegatedAddress)
        const isAuthorized = await contract.isUserAuthorized(ethereumProvider.selectedAddress, delegatedAddress)
        console.log('isAuthorized', isAuthorized)
    }, [ethereumProvider, dispatch])
}
