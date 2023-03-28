import Hint from '$/components/Hint'
import Label from '$/components/Label'
import Modal, { Props as ModalProps } from '$/components/modals/Modal'
import TextField from '$/components/TextField'
import { Address } from '$/types'
import i18n from '$/utils/i18n'
import { useDispatch } from 'react-redux'
import tw from 'twin.macro'
import useCopy from '$/hooks/useCopy'
import { ToasterAction } from '$/features/toaster'
import { ToastType } from '$/components/Toast'
import Submit from '$/components/Submit'

interface Props extends ModalProps {
    anonAccount?: Address
    anonPrivateKey?: string
}

export default function AnonExplainerModal({
    title = i18n('anonExplainer.title'),
    anonAccount = '',
    anonPrivateKey = '',
    onReject,
    ...props
}: Props) {
    const dispatch = useDispatch()

    const { copy } = useCopy()

    return (
        <Modal {...props} onReject={onReject} title={title}>
            <p
                css={tw`
                    leading-6
                    text-[14px]
                `}
            >
                {i18n('anonExplainer.desc')}
            </p>
            <Label css={tw`mt-6`}>{i18n('anonExplainer.addressLabel')}</Label>
            <TextField defaultValue={anonAccount} readOnly />
            {!!i18n('anonExplainer.addressHint') && (
                <Hint>{i18n('anonExplainer.addressHint')}</Hint>
            )}
            {!!anonPrivateKey && (
                <>
                    <Label css={tw`mt-6`}>
                        <div
                            css={tw`
                                flex
                                items-center
                            `}
                        >
                            <div css={tw`grow`}>{i18n('anonExplainer.privateKeyLabel')}</div>
                            <button
                                type="button"
                                css={tw`appearance-none`}
                                onClick={() => {
                                    copy(anonPrivateKey)

                                    dispatch(
                                        ToasterAction.show({
                                            title: i18n('common.copied'),
                                            type: ToastType.Success,
                                        })
                                    )
                                }}
                            >
                                {i18n('common.copy')}
                            </button>
                        </div>
                    </Label>
                    <TextField defaultValue={anonPrivateKey} readOnly type="password" />
                    <Submit
                        label={i18n('anonExplainer.okLabel')}
                        type="button"
                        onClick={() => void onReject?.()}
                    />
                </>
            )}
        </Modal>
    )
}

AnonExplainerModal.displayName = 'AnonExplainerModal'
