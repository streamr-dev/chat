import { useSelector } from 'react-redux'
import { selectDelegatedAccount, selectDelegatedClient } from './selectors'

export function useDelegatedClient() {
    return useSelector(selectDelegatedClient)
}

export function useDelegatedAccount() {
    return useSelector(selectDelegatedAccount)
}
