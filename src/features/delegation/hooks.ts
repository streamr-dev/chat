import { DelegationAction } from '$/features/delegation'
import { selectFlag } from '$/features/flag/selectors'
import { useWalletAccount, useWalletProvider } from '$/features/wallet/hooks'
import { Address } from '$/types'
import formatFingerprint from '$/utils/formatFingerprint'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { selectDelegatedAccount, selectDelegatedClient } from './selectors'

export function useDelegatedClient() {
    return useSelector(selectDelegatedClient)
}

export function useDelegatedAccount() {
    return useSelector(selectDelegatedAccount)
}

function requestPrivateKeyFP(owner: Address) {
    return formatFingerprint(DelegationAction.requestPrivateKey.toString(), owner.toLowerCase())
}

export function useIsDelegatingAccess() {
    const owner = useWalletAccount()

    return useSelector(selectFlag(owner ? requestPrivateKeyFP(owner) : undefined))
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
                fingerprint: requestPrivateKeyFP(owner),
            })
        )
    }, [owner, provider, isDelegatingAccess])
}
