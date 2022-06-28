import { useSelector } from 'react-redux'
import {
    selectWalletAccount,
    selectWalletClient,
    selectWalletIntegrationId,
    selectWalletProvider,
} from './selectors'

export function useWalletIntegrationId() {
    return useSelector(selectWalletIntegrationId)
}

export function useWalletAccount() {
    return useSelector(selectWalletAccount)
}

export function useWalletProvider() {
    return useSelector(selectWalletProvider)
}

export function useWalletClient() {
    return useSelector(selectWalletClient)
}
