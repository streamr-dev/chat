import Modal from '$/components/modals/Modal'
import { useDelegatedAccount } from '$/features/delegation/hooks'
import { WalletAction } from '$/features/wallet'
import { useWalletAccount, useWalletIntegrationId } from '$/features/wallet/hooks'
import { WalletIntegrationId } from '$/features/wallet/types'
import integrations from '$/utils/integrations'
import { useDispatch } from 'react-redux'
import tw from 'twin.macro'
import { Props as ModalProps } from './Modal'

export default function WalletModal({ title = 'Select a wallet', ...props }: ModalProps) {
    const dispatch = useDispatch()

    const iid = useWalletIntegrationId()

    const account = useWalletAccount()

    const delegatedAccount = useDelegatedAccount()

    function connect(integrationId: WalletIntegrationId) {
        if (iid === integrationId && account && delegatedAccount) {
            return
        }

        dispatch(WalletAction.connect({ integrationId, eager: false }))
    }

    return (
        <Modal {...props} title={title}>
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

type WalletOptionProps<T> = {
    integrationId: T
    onClick?: (integrationId: T) => void
}

function WalletOption<T extends WalletIntegrationId>({
    integrationId,
    onClick: onClickProp,
}: WalletOptionProps<T>) {
    const { label, icon: Icon } = integrations.get(integrationId)!

    const currentIntegrationId = useWalletIntegrationId()

    return (
        <button
            onClick={() => {
                if (typeof onClickProp === 'function') {
                    onClickProp(integrationId)
                }
            }}
            type="button"
            css={[
                tw`
                    bg-[#F1F4F7]
                    flex
                    h-24
                    items-center
                    px-8
                    rounded
                    rounded-lg
                    text-left
                    w-full
                    transition-colors
                    hover:bg-[#dfe3e8]
                    active:bg-[#d0d4d9]
                    [svg]:block
                    [svg]:h-8
                    [svg]:w-8
                `,
                currentIntegrationId === integrationId &&
                    tw`
                        border-2
                        border-[#FF5924]
                        !bg-[white]
                        cursor-default
                    `,
            ]}
        >
            <div
                css={[
                    tw`
                        flex-grow
                    `,
                ]}
            >
                {label}
            </div>
            <div>
                <Icon />
            </div>
        </button>
    )
}

WalletModal.displayName = 'WalletModal'