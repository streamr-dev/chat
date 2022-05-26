import { useSelector } from 'react-redux'
import { selectWalletAccount, selectWalletIntegrationId } from './selectors'

export function useWalletIntegrationId() {
    return useSelector(selectWalletIntegrationId)
}

export function useWalletAccount() {
    return useSelector(selectWalletAccount)
}
