import { WalletAction } from '$/features/wallet'
import { Contract } from 'ethers'
import { useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    selectWalletAccount,
    selectWalletClient,
    selectWalletIntegrationId,
    selectWalletProvider,
} from './selectors'

import * as DelegatedAccessRegistry from '../../contracts/DelegatedAccessRegistry.sol/DelegatedAccessRegistry.json'

const DelegatedAccessRegistryAddress = '0xf5803cdA6352c515Ee11256EAA547BE8422cC4EE'


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

export function isDelegatedAccount(
) {
    return useSelector(selectIsDelegatedAccount)
}
