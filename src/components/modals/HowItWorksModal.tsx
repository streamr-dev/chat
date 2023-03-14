import Modal, { Props } from '$/components/modals/Modal'
import i18n from '$/utils/i18n'
import tw from 'twin.macro'

export default function HowItWorksModal({
    title = i18n('howItWorksModal.title'),
    ...props
}: Props) {
    return (
        <Modal {...props} title={title}>
            <div
                css={tw`
                    text-[14px]
                    [p + p]:mt-6
                    leading-6
                `}
            >
                {i18n('howItWorksModal.content')}
            </div>
        </Modal>
    )
}
