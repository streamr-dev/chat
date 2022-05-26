import { ethers } from 'ethers'
import { useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { setWalletAccount } from '../features/wallet/actions'
import { useWalletIntegrationId } from '../features/wallet/hooks'
import getConnector from '../utils/getConnector'

export default function WalletIntegrationObserver() {
    const integrationId = useWalletIntegrationId()

    const dispatch = useDispatch()

    const [, hooks] = getConnector(integrationId)

    const isActive = hooks.useIsActive()

    useEffect(() => {
        let mounted = true

        const { provider } = getConnector(integrationId)[0]

        async function fn() {
            if (!provider || !isActive) {
                dispatch(setWalletAccount(null))
                return
            }

            const web3Provider = new ethers.providers.Web3Provider(provider)

            dispatch(setWalletAccount(undefined))

            let accounts: string[] = []

            try {
                accounts = await web3Provider.listAccounts()
            } catch (e) {
                console.warn('Failed to list accounts', e)
            }

            if (!mounted) {
                return
            }

            dispatch(setWalletAccount(accounts[0] || null))
        }

        fn()

        return () => {
            mounted = false
        }
    }, [integrationId, isActive])

    const integrationIdRef = useRef(integrationId)

    useEffect(() => {
        const [connector] = getConnector(integrationIdRef.current)

        if (typeof connector.connectEagerly === 'function') {
            connector.connectEagerly()
        }
    }, [])

    return null
}
