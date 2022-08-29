import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import tw from 'twin.macro'
import { WalletAction } from '$/features/wallet'
import { useWalletIntegrationId } from '$/features/wallet/hooks'
import { WalletIntegrationId } from '$/features/wallet/types'
import getConnector from '$/utils/getConnector'
import integrations from '$/utils/integrations'
import Modal, { ModalProps } from '../Modal'
import WalletOption from './WalletOption'

export default function WalletModal(props: ModalProps) {
    const dispatch = useDispatch()

    const [nextIntegrationId, setNextIntegrationId] = useState<WalletIntegrationId | undefined>(
        useWalletIntegrationId()
    )

    const [, nextHooks] = getConnector(nextIntegrationId)

    const isActive = nextHooks.useIsActive()

    useEffect(() => {
        if (isActive) {
            dispatch(WalletAction.setIntegrationId(nextIntegrationId))
        }
    }, [nextIntegrationId, isActive])

    async function connect(integrationId: WalletIntegrationId) {
        setNextIntegrationId(integrationId)

        dispatch(WalletAction.connect(integrationId))
    }

    return (
        <Modal {...props} title="Select a wallet">
            <div
                css={[
                    tw`
                        [button + button]:mt-4
                    `,
                ]}
            >
                {[...integrations.keys()].map((integrationId) => (
                    <WalletOption
                        key={integrationId}
                        integrationId={integrationId}
                        onClick={connect}
                    />
                ))}
            </div>
        </Modal>
    )
}
