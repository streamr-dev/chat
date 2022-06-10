import { useSelector } from 'react-redux'
import { selectDelegatedAccount, selectDelegatedClient, selectIsDelegating } from './selectors'

export function useDelegatedClient() {
    return useSelector(selectDelegatedClient)
}

export function useDelegatedAccount() {
    return useSelector(selectDelegatedAccount)
}

export function useIsDelegating() {
    return useSelector(selectIsDelegating)
}
