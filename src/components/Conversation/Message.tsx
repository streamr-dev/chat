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
import { OptionalAddress } from '$/types'
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

interface Props extends HTMLAttributes<HTMLDivElement> {
    payload: IMessage
    previousCreatedBy?: OptionalAddress
}

function formatMessage(message: string): ReactNode {
    const chunks = message.split(' ')

    return (
        <>
            {chunks.map((chunk, i) => {
                return (
                    <Fragment key={i}>
                        {/^https?:\/\/\S+$/.test(chunk) ? <Link href={chunk}>{chunk}</Link> : chunk}
                        {i !== chunks.length - 1 && ' '}
                    </Fragment>
                )
            })}
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

    const avatar = skipAvatar ? <Wrap /> : <Avatar seed={sender?.toLowerCase()} />

    const dispatch = useDispatch()

    useEffect(() => {
        if (sender || !provider) {
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
                isResending &&
                    tw`
                        block!
                    `,
                tw`
                    appearance-none
                    text-[#59799C]
                    text-[12px]
                    hidden
                `,
                left
                    ? tw`
                        ml-[22px]
                    `
                    : tw`
                        mr-[22px]
                    `,
            ]}
        >
            {isResending ? 'Retrying…' : 'Retry'}
        </button>
    )
}

function EncryptedMessage() {
    return (
        <Text>
            <em>Message could not be decrypted</em>
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
