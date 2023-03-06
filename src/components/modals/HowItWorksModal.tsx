import Modal, { Props } from '$/components/modals/Modal'
import { I18n } from '$/utils/I18n'
import tw from 'twin.macro'

export default function HowItWorksModal({ title = I18n.howItWorksModal.title(), ...props }: Props) {
    return (
        <Modal {...props} title={title}>
            <div
                css={tw`
                    text-[14px]
                    [p + p]:mt-6
                    leading-6
                `}
            >
                {I18n.howItWorksModal.content()}
            </div>
        </Modal>
    )
}
