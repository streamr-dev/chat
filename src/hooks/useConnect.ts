import { useCallback } from 'react'
import { ActionType, useDispatch, useStore } from '../components/Store'

export default function useConnect(): () => Promise<void> {
    const { ethereumProvider } = useStore()

    const dispatch = useDispatch()

    return useCallback(async () => {
        if (!ethereumProvider) {
            return
        }

        try {
            const accounts = (await ethereumProvider.request({
                method: 'eth_requestAccounts',
            })) as string[]

            dispatch({
                type: ActionType.SetAccount,
                payload: accounts[0],
            })
        } catch (e: any) {
            if (e.code === 4001) {
                console.warn('Please connect to MetaMask.')
            } else {
                console.error(e)
            }
        }
    }, [ethereumProvider, dispatch])
}
