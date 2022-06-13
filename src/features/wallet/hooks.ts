import { useSelector } from 'react-redux'
import { selectWalletAccount, selectWalletIntegrationId, selectWalletProvider } from './selectors'

export function useWalletIntegrationId() {
    return useSelector(selectWalletIntegrationId)
}

export function useWalletAccount() {
    return useSelector(selectWalletAccount)
}

export function useWalletProvider() {
    return useSelector(selectWalletProvider)
}
