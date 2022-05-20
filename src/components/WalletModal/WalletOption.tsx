import tw from 'twin.macro'
import { WalletIntegrationId } from '../../../types/wallet'
import { useWalletIntegrationId } from '../../features/wallet'
import integrations from '../../utils/integrations'

type Props = {
    integrationId: WalletIntegrationId
    onClick?: (integrationId: WalletIntegrationId) => void
}

export default function WalletOption({
    integrationId,
    onClick: onClickProp,
}: Props) {
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
