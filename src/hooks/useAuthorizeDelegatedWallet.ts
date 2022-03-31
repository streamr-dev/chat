import { useCallback } from 'react'
import { useStore } from '../components/Store'
import getEnvironmentConfig from '../getters/getEnvironmentConfig'
import getContractAt from '../getters/getContractAt'

type Options = {
    delegatedAddress: string
    displayAlerts?: boolean
}
export default function useAuthorizeDelegatedWallet(): ({
    delegatedAddress,
    displayAlerts,
}: Options) => Promise<void> {
    const { ethereumProvider } = useStore()
    const { DelegatedAccessRegistryAddress } = getEnvironmentConfig()

    return useCallback(
        async ({ delegatedAddress, displayAlerts }) => {
            const delegatedAccessRegistry = getContractAt({
                address: DelegatedAccessRegistryAddress,
                artifact: 'DelegatedAccessRegistry',
                provider: ethereumProvider as any,
            })

            const [isAuthorized] =
                await delegatedAccessRegistry.functions.isAuthorized(
                    delegatedAddress
                )

            if (!isAuthorized) {
                await delegatedAccessRegistry.functions.authorize(
                    delegatedAddress
                )
            }

            if (!displayAlerts) {
                return
            }

            if (!isAuthorized) {
                alert(
                    `Authorized ${delegatedAddress} to access your account on contract ${DelegatedAccessRegistryAddress}`
                )
            } else {
                alert(
                    `Delegated wallet [${delegatedAddress}] is already authorized to access your account on contract ${DelegatedAccessRegistryAddress}`
                )
            }
        },
        [ethereumProvider, DelegatedAccessRegistryAddress]
    )
}
