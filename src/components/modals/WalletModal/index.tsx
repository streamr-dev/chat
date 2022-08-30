import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import tw from 'twin.macro'
import { WalletAction } from '$/features/wallet'
import { WalletIntegrationId } from '$/features/wallet/types'
import integrations from '$/utils/integrations'
import Modal, { ModalProps } from '../Modal'
import WalletOption from './WalletOption'
import { useWalletAccount, useWalletIntegrationId } from '$/features/wallet/hooks'
import { useDelegatedAccount } from '$/features/delegation/hooks'

export default function WalletModal(props: ModalProps) {
    const dispatch = useDispatch()

    const iid = useWalletIntegrationId()

    const account = useWalletAccount()

    const delegatedAccount = useDelegatedAccount()

    const connect = useCallback(
        (integrationId: WalletIntegrationId) => {
            if (iid === integrationId && account && delegatedAccount) {
                return
            }

            dispatch(WalletAction.connect({ integrationId, eager: false }))
        },
        [iid, delegatedAccount, account]
    )

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
