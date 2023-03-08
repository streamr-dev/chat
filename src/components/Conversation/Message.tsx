import {
    AnchorHTMLAttributes,
    ButtonHTMLAttributes,
    Fragment,
    HTMLAttributes,
    ReactNode,
    useEffect,
    useReducer,
    useState,
} from 'react'
import tw, { css } from 'twin.macro'
import { IMessage } from '$/features/message/types'
import Avatar, { Wrap } from '../Avatar'
import Text from '../Text'
import DateTooltip from './DateTooltip'
import { useWalletAccount, useWalletProvider } from '$/features/wallet/hooks'
import useSeenMessageEffect from '$/hooks/useSeenMessageEffect'
import useMainAccount from '$/hooks/useMainAccount'
import isSameAddress from '$/utils/isSameAddress'
import { Address, OptionalAddress } from '$/types'
import { useDispatch } from 'react-redux'
import { Flag } from '$/features/flag/types'
import trunc from '$/utils/trunc'
import useAlias from '$/hooks/useAlias'
import useENSName from '$/hooks/useENSName'
import { RoomId } from '$/features/room/types'
import { MessageAction } from '$/features/message'
import { useDelegatedAccount, useDelegatedClient } from '$/features/delegation/hooks'
import useFlag from '$/hooks/useFlag'
import { DelegationAction } from '$/features/delegation'
import useAnonAccount from '$/hooks/useAnonAccount'
import { Provider } from '@web3-react/types'
import i18n from '$/utils/i18n'

interface Props extends HTMLAttributes<HTMLDivElement> {
    payload: IMessage
    previousCreatedBy?: OptionalAddress
}

function formatMessage(message: string): ReactNode {
    const rexp = /https?:\/\/[-a-z0-9@:%_+.~#?&/=]{2,256}/gi

    if (!rexp.test(message)) {
        return message
    }

    const [first, ...texts] = message.split(rexp)

    const links = message.match(rexp) || []

    return (
        <>
            {first}
            {links.map((href, i) => (
                <Fragment key={i}>
                    <Link href={links[i]}>{links[i]}</Link>
                    {texts[i]}
                </Fragment>
            ))}
        </>
    )
}

export default function Message({ payload, previousCreatedBy, ...props }: Props) {
    const { createdBy, createdAt, content, seenAt, roomId, id } = payload

    const isEncrypted = typeof content === 'undefined'

    const isSeen = Boolean(seenAt)

    const requester = useWalletAccount()

    const [element, setElement] = useState<null | HTMLDivElement>(null)

    const sender = useMainAccount(createdBy)

    const alias = useAlias(sender)

    const ens = useENSName(sender)

    const previousSender = useMainAccount(previousCreatedBy)

    useSeenMessageEffect(element, id, roomId, requester, { skip: isSeen || isEncrypted })

    const provider = useWalletProvider()

    const skipAvatar = !!previousCreatedBy && isSameAddress(sender, previousSender)

    const avatar =
        sender === null ? (
            <Wrap>
                {!!createdBy && !!provider && (
                    <LookupAddressButton creator={createdBy} provider={provider} />
                )}
            </Wrap>
        ) : skipAvatar ? (
            <Wrap />
        ) : (
            <Avatar seed={sender?.toLowerCase()} />
        )

    const dispatch = useDispatch()

    useEffect(() => {
        if (typeof sender !== 'undefined' || !provider) {
            return
        }

        dispatch(
            DelegationAction.lookup({
                delegated: createdBy,
                provider,
                fingerprint: Flag.isLookingUpDelegation(createdBy),
            })
        )
    }, [sender, provider, createdBy, dispatch])

    const delegatedAccount = useDelegatedAccount()

    const anonAccount = useAnonAccount(roomId)

    const incoming =
        !isSameAddress(requester, createdBy) &&
        !isSameAddress(delegatedAccount, createdBy) &&
        !isSameAddress(sender, requester) &&
        !isSameAddress(anonAccount, createdBy)

    return (
        <>
            {!skipAvatar && sender && incoming && (
                <div
                    css={tw`
                        font-medium
                        text-[#59799C]
                        text-[12px]
                        pl-16
                    `}
                >
                    <div css={tw`relative`}>
                        <Sender short={ens || alias || trunc(sender)} full={sender} />
                    </div>
                </div>
            )}
            <div
                {...props}
                ref={setElement}
                css={[
                    isEncrypted &&
                        css`
                            :hover > button {
                                display: block;
                            }
                        `,
                    tw`flex`,
                    !incoming && tw`justify-end`,
                ]}
            >
                {incoming && <div tw="mr-4 shrink-0">{avatar}</div>}
                {!incoming && isEncrypted && typeof createdAt === 'number' && (
                    <ResendOneButton requester={requester} roomId={roomId} timestamp={createdAt} />
                )}
                <div
                    css={[
                        css`
                            flex: 0 1 auto;

                            :hover div:first-of-type {
                                opacity: 1;
                                visibility: visible;
                                transition-delay: 0.25s;
                            }
                        `,
                        tw`
                            bg-[#F1F4F7]
                            rounded-xl
                            text-[0.875rem]
                            leading-7
                            max-w-full
                            min-w-0
                            px-4
                            py-1.5
                            relative
                            break-words
                        `,
                        !incoming &&
                            tw`
                                bg-[#615ef0]
                                text-white
                            `,
                        isEncrypted &&
                            tw`
                                text-[#59799C]
                                border-2
                                border-dotted
                                border-[#59799C]
                                bg-[#F7F9FC]
                                py-1
                            `,
                    ]}
                >
                    <DateTooltip timestamp={createdAt} />
                    {incoming && (
                        <div
                            css={tw`
                                w-1.5
                                h-1.5
                                absolute
                                top-1/2
                                translate-x-full
                                -translate-y-1/2
                                right-[-5px]
                                lg:-right-2.5
                            `}
                        >
                            <div
                                css={[
                                    tw`
                                        w-full
                                        h-full
                                        rounded-full
                                        bg-[#59799C]
                                    `,
                                    !!isSeen &&
                                        css`
                                            opacity: 0;
                                            transform: scale(0.1);
                                            visibility: hidden;
                                            transition: 300ms ease-in;
                                            transition-property: visibility, opacity, transform;
                                            transition-delay: 300ms, 0s, 0s;
                                        `,
                                ]}
                            />
                        </div>
                    )}
                    {isEncrypted ? (
                        <EncryptedMessage />
                    ) : (
                        <Text css={tw`whitespace-pre-wrap`}>{formatMessage(content)}</Text>
                    )}
                </div>
                {!incoming && <div tw="ml-4 shrink-0">{avatar}</div>}
                {incoming && isEncrypted && typeof createdAt === 'number' && (
                    <ResendOneButton
                        left
                        requester={requester}
                        roomId={roomId}
                        timestamp={createdAt}
                    />
                )}
            </div>
        </>
    )
}

interface ResendOneButtonProps
    extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'onClick' | 'children'> {
    left?: boolean
    requester: OptionalAddress
    roomId: RoomId
    timestamp: number
}

function ResendOneButton({
    left = false,
    requester,
    roomId,
    timestamp,
    ...props
}: ResendOneButtonProps) {
    const dispatch = useDispatch()

    const delegatedClient = useDelegatedClient()

    const isResending = useFlag(
        requester ? Flag.isResendingTimestamp(roomId, requester, timestamp) : undefined
    )

    function onClick() {
        if (!requester || !delegatedClient) {
            return
        }

        dispatch(
            MessageAction.resend({
                roomId,
                requester,
                exact: true,
                timestamp,
                streamrClient: delegatedClient,
                fingerprint: Flag.isResendingTimestamp(roomId, requester, timestamp),
            })
        )
    }

    return (
        <button
            {...props}
            onClick={onClick}
            type="button"
            css={[
                isResending && tw`block!`,
                tw`
                    appearance-none
                    text-[#59799C]
                    text-[12px]
                    hidden
                `,
                left ? tw`ml-[22px]` : tw`mr-[22px]`,
            ]}
        >
            {i18n('common.retry', isResending)}
        </button>
    )
}

function EncryptedMessage() {
    return (
        <Text>
            <em>{i18n('common.encryptedMessagePlaceholder')}</em>
        </Text>
    )
}

function Link(props: Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'target' | 'rel'>) {
    return <a {...props} target="_blank" rel="noreferrer noopener" css={tw`underline`} />
}

interface SenderProps
    extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'type' | 'onClick'> {
    short: string
    full: string
}

function Sender({ short, full, ...props }: SenderProps) {
    const [showFull, toggle] = useReducer((x) => !x, false)

    return (
        <button
            {...props}
            type="button"
            onClick={() => void toggle()}
            css={[
                css`
                    div {
                        transition: 200ms ease-in-out;
                        transition-property: visibility, opacity;
                        transition-delay: 0s;
                    }
                `,
                tw`
                    appearance-none
                    [div]:(
                        absolute
                        top-0
                        left-0
                        truncate
                        w-min
                        max-w-full
                    )
                `,
            ]}
        >
            &zwnj;
            <div
                css={
                    showFull &&
                    tw`
                        invisible
                        opacity-0
                        delay-200
                    `
                }
            >
                {short}
            </div>
            <div
                css={[
                    tw`
                        invisible
                        opacity-0
                        delay-200
                    `,
                    showFull &&
                        tw`
                            visible
                            opacity-100
                        `,
                ]}
            >
                {full}
            </div>
        </button>
    )
}

function LookupAddressButton({ creator, provider }: { creator: Address; provider: Provider }) {
    const dispatch = useDispatch()

    return (
        <button
            type="button"
            onClick={() => {
                dispatch(
                    DelegationAction.setDelegation({
                        delegated: creator,
                        main: undefined,
                    })
                )

                dispatch(
                    DelegationAction.lookup({
                        delegated: creator,
                        provider,
                        fingerprint: Flag.isLookingUpDelegation(creator),
                    })
                )
            }}
            css={tw`
                appearance-none
                rounded-full
                bg-gray-100
                w-full
                h-full
                flex
                items-center
                justify-center
                text-[#59799C]
            `}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                css={tw`
                    w-1/3
                    h-1/3
                `}
            >
                {/* Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. */}
                {/* NOTE: The reload icon is free. */}
                <path
                    d="M370.3 160H320c-17.7 0-32 14.3-32 32s14.3 32 32 32H448c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32s-32 14.3-32 32v51.2L398.4 97.6c-87.5-87.5-229.3-87.5-316.8 0s-87.5 229.3 0 316.8s229.3 87.5 316.8 0c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0c-62.5 62.5-163.8 62.5-226.3 0s-62.5-163.8 0-226.3s163.8-62.5 226.3 0L370.3 160z"
                    fill="currentColor"
                />
            </svg>
        </button>
    )
}
