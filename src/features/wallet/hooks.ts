import { useSelector } from 'react-redux'
import { selectWalletAccount, selectWalletClient, selectWalletIntegrationId } from './selectors'

export function useWalletIntegrationId() {
    return useSelector(selectWalletIntegrationId)
}

export function useWalletAccount() {
    return useSelector(selectWalletAccount)
}

export function useWalletClient() {
    return useSelector(selectWalletClient)
}
