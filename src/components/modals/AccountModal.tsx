import Hint from '$/components/Hint'
import SecondaryButton from '$/components/SecondaryButton'
import Text from '$/components/Text'
import TextField from '$/components/TextField'
import { ToastType } from '$/components/Toast'
import Toggle from '$/components/Toggle'
import { PreferencesAction } from '$/features/preferences'
import { usePreferences } from '$/features/preferences/hooks'
import { ToasterAction } from '$/features/toaster'
import { useWalletAccount, useWalletIntegrationId } from '$/features/wallet/hooks'
import useCopy from '$/hooks/useCopy'
import getExplorerURL from '$/utils/getExplorerURL'
import integrations from '$/utils/integrations'
import trunc from '$/utils/trunc'
import { AnchorHTMLAttributes } from 'react'
import { useDispatch } from 'react-redux'
import tw from 'twin.macro'
import Modal, { Props as ModalProps } from './Modal'

interface Props extends ModalProps {
    onProceed?: () => void
}

export default function AccountModal({ title = 'Account', onProceed, ...props }: Props) {
    const integrationId = useWalletIntegrationId()

    const { label } = integrations.get(integrationId!)!

    const account = useWalletAccount() || ''

    const { copy, isCopied } = useCopy()

    const preferences = usePreferences()

    const showHiddenRooms = Boolean(preferences?.showHiddenRooms)

    const retrieveHotWalletImmediately = Boolean(preferences?.retrieveHotWalletImmediately)

    const dispatch = useDispatch()

    return (
        <>
            <Modal {...props} title={title}>
                <div
                    css={tw`
                        text-[#59799C]
                        flex
                        items-center
                    `}
                >
                    <div
                        css={tw`
                            text-[14px]
                            md:text-[1em]
                            grow
                            mr-4
                        `}
                    >
                        Connected with {label}
                    </div>
                    <div>
                        <SecondaryButton onClick={() => void onProceed?.()}>
                            <Text>Change</Text>
                        </SecondaryButton>
                    </div>
                </div>
                <TextField readOnly value={trunc(account)} css={tw`mt-3`} />
                <div
                    css={tw`
                        mt-3
                        flex
                        [> a + a]:ml-10
                    `}
                >
                    <ExternalLink
                        href={getExplorerURL(account!)}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <svg
                            width="12"
                            height="12"
                            viewBox="0 0 12 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M7.33333 1.33333C6.96514 1.33333 6.66667 1.03486 6.66667 0.666667C6.66667 0.298477 6.96514 0 7.33333 0H11.3333C11.5101 0 11.6797 0.070238 11.8047 0.195262C11.9298 0.320287 12 0.489856 12 0.666667L12 4.66667C12 5.03486 11.7015 5.33333 11.3333 5.33333C10.9651 5.33333 10.6667 5.03486 10.6667 4.66667L10.6667 2.27614L4.4714 8.4714C4.21106 8.73175 3.78894 8.73175 3.5286 8.4714C3.26825 8.21105 3.26825 7.78894 3.5286 7.52859L9.72386 1.33333H7.33333ZM0 2.66667C0 1.93029 0.596954 1.33333 1.33333 1.33333H4.66667C5.03486 1.33333 5.33333 1.63181 5.33333 2C5.33333 2.36819 5.03486 2.66667 4.66667 2.66667H1.33333V10.6667H9.33333V7.33333C9.33333 6.96514 9.63181 6.66667 10 6.66667C10.3682 6.66667 10.6667 6.96514 10.6667 7.33333V10.6667C10.6667 11.403 10.0697 12 9.33333 12H1.33333C0.596954 12 0 11.403 0 10.6667V2.66667Z"
                                fill="currentColor"
                            />
                        </svg>
                        <Text>View on explorer</Text>
                    </ExternalLink>
                    <ExternalLink
                        href="#"
                        onClick={(e) => {
                            e.preventDefault()
                            copy(account!)

                            dispatch(
                                ToasterAction.show({
                                    title: 'Copied to clipboard',
                                    type: ToastType.Success,
                                })
                            )
                        }}
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M0.5 2C0.5 1.17157 1.17157 0.5 2 0.5H9.5C10.3284 0.5 11 1.17157 11 2V5H14C14.8284 5 15.5 5.67157 15.5 6.5V14C15.5 14.8284 14.8284 15.5 14 15.5H6.5C5.67157 15.5 5 14.8284 5 14V11H2C1.17157 11 0.5 10.3284 0.5 9.5V2ZM6.5 11V14H14V6.5H11V9.5C11 10.3284 10.3284 11 9.5 11H6.5ZM9.5 9.5V2L2 2V9.5H9.5Z"
                                fill="currentColor"
                            />
                        </svg>
                        <Text>{isCopied ? 'Copied!' : 'Copy address'}</Text>
                    </ExternalLink>
                </div>
                <hr css={tw`my-3`} />
                <div css={tw`flex`}>
                    <div css={tw`grow`}>
                        <Hint css={tw`pr-16`}>
                            <Text>Show hidden rooms</Text>
                        </Hint>
                    </div>
                    <div css={tw`mt-2`}>
                        <Toggle
                            value={showHiddenRooms}
                            onClick={() => {
                                if (!account) {
                                    return
                                }

                                dispatch(
                                    PreferencesAction.set({
                                        owner: account,
                                        showHiddenRooms: !showHiddenRooms,
                                    })
                                )
                            }}
                        />
                    </div>
                </div>
                <div css={tw`flex`}>
                    <div css={tw`grow`}>
                        <Hint css={tw`pr-16`}>
                            <Text>Retrieve hot wallet on login</Text>
                        </Hint>
                    </div>
                    <div css={tw`mt-2`}>
                        <Toggle
                            value={retrieveHotWalletImmediately}
                            onClick={() => {
                                if (!account) {
                                    return
                                }

                                dispatch(
                                    PreferencesAction.set({
                                        owner: account,
                                        retrieveHotWalletImmediately: !retrieveHotWalletImmediately,
                                    })
                                )
                            }}
                        />
                    </div>
                </div>
            </Modal>
        </>
    )
}

AccountModal.displayName = 'AccountModal'

function ExternalLink(props: AnchorHTMLAttributes<HTMLAnchorElement>) {
    return (
        <a
            {...props}
            css={tw`
                flex
                items-center
                text-[12px]
                md:text-[14px]
                !text-[#FF5924]
                [svg]:block
                [svg]:mr-2
            `}
        />
    )
}
