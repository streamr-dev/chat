import { useCallback } from 'react'
import { useStore } from '../components/Store'
import getContractAt from '../getters/getContractAt'

const StreamRegistryAddress = '0x0D483E10612F327FC11965Fc82E90dC19b141641'

type ListenerParams = () => Promise<void>

export default function useContractListenerScaffolding(): ListenerParams {
    const { account, ethereumProvider } = useStore()

    return useCallback(async () => {
        if (!ethereumProvider || !account) {
            return
        }
        const instance = getContractAt({
            address: StreamRegistryAddress,
            artifact: 'StreamRegistry',
            provider: ethereumProvider as any,
        })

        console.log('streamRegistry instance', instance)
    }, [account, ethereumProvider])
}
