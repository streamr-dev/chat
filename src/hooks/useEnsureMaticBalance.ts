import { providers } from 'ethers'
import { useCallback } from 'react'
import { toast } from 'react-toastify'
import { useStore } from '../components/Store'

type BalanceEnsurer = () => Promise<void>

export default function useEnsureMaticBalance(): BalanceEnsurer {
    const { account, ethereumProvider } = useStore()

    return useCallback(async () => {
        if (!account) {
            return
        }

        const provider = new providers.Web3Provider(ethereumProvider as any)

        const balance = await provider.getBalance(account)

        if (!balance.gt(0)) {
            const message =
                "MATIC is needed for gas, but you don't have any. Please get some and try again"
            toast.error(message, {
                position: 'top-center',
            })
            throw new Error(message)
        }
    }, [account, ethereumProvider])
}
