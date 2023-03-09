import { DelegationAction } from '$/features/delegation'
import { selectFlag } from '$/features/flag/selectors'
import { Flag } from '$/features/flag/types'
import { useWalletAccount } from '$/features/wallet/hooks'
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

    return useSelector(selectFlag(delegator ? Flag.isAccessBeingDelegated(delegator) : undefined))
}

export function useRequestPrivateKey() {
    const dispatch = useDispatch()

    const owner = useWalletAccount()

    const isDelegatingAccess = useIsDelegatingAccess()

    return useCallback(() => {
        if (isDelegatingAccess || !owner) {
            return
        }

        dispatch(
            DelegationAction.requestPrivateKey({
                owner,
                fingerprint: Flag.isAccessBeingDelegated(owner),
            })
        )
    }, [owner, isDelegatingAccess])
}
