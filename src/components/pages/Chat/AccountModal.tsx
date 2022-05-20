import tw, { css } from 'twin.macro'
import { useWalletIntegrationId } from '../../../features/wallet'
import integrations from '../../../utils/integrations'
import Button from '../../Button'
import Modal, { ModalProps } from '../../Modal'
import Text from '../../Text'

type Props = ModalProps & {
    onChangeClick?: () => void
}

export default function AccountModal({ onChangeClick, ...props }: Props) {
    const integrationId = useWalletIntegrationId()

    const { label } = integrations.get(integrationId!)!

    return (
        <Modal {...props} title="Account">
            <div
                css={[
                    tw`
                        text-[#59799C]
                        flex
                        items-center
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
                    Connected with {label}
                </div>
                <div>
                    <Button
                        onClick={onChangeClick}
                        css={[
                            css`
                                color: inherit;
                            `,
                            tw`
                                bg-[#EFF4F9]
                                h-[30px]
                                px-3
                                rounded-[15px]
                            `,
                        ]}
                    >
                        <Text>Change</Text>
                    </Button>
                </div>
            </div>
        </Modal>
    )
}
