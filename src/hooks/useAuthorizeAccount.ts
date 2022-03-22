import { useCallback } from 'react'
import { ActionType, useDispatch, useStore } from '../components/Store'

export default function useAuthorizeAccount(): (account: string) => Promise<void> {
    const { ethereumProvider } = useStore()

    const dispatch = useDispatch()

    return useCallback(async (account: string) => {
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
