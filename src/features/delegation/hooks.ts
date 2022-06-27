import { DelegationAction } from '$/features/delegation'
import { selectFlag } from '$/features/flag/selectors'
import { Flag } from '$/features/flag/types'
import { useWalletAccount, useWalletProvider } from '$/features/wallet/hooks'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectDelegatedAccount, selectDelegatedClient } from './selectors'

export function useDelegatedClient() {
    return useSelector(selectDelegatedClient)
}

export function useDelegatedAccount() {
    return useSelector(selectDelegatedAccount)
}

export function useIsDelegatingAccess() {
    const delegator = useWalletAccount()

    if (!delegator) {
        return false
    }

    return useSelector(selectFlag(Flag.isAccessBeingDelegated(delegator)))
}

export function useRequestPrivateKey() {
    const dispatch = useDispatch()

    const owner = useWalletAccount()

    const provider = useWalletProvider()

    const isDelegatingAccess = useIsDelegatingAccess()

    return useCallback(() => {
        if (isDelegatingAccess || !owner || !provider) {
            return
        }

        dispatch(
            DelegationAction.requestPrivateKey({
                owner,
                provider,
                fingerprint: Flag.isPrivateKeyBeingRequested(owner),
            })
        )
    }, [owner, provider, isDelegatingAccess])
}
