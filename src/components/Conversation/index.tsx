import { StreamPermission } from 'streamr-client'
import tw from 'twin.macro'
import useAbility from '$/hooks/useAbility'
import useMessages from '$/hooks/useMessages'
import ConversationHeader from './ConversationHeader'
import EmptyMessageFeed from './EmptyMessageFeed'
import MessageFeed from './MessageFeed'
import MessageInput from './MessageInput'
import { usePrivacy, useSelectedRoomId } from '$/features/room/hooks'
import useCanGrant from '$/hooks/useCanGrant'
import useResendEffect from '$/hooks/useResendEffect'
import useResends from '$/hooks/useResends'
import useAddMemberModal from '$/hooks/useAddMemberModal'
import useEditMembersModal from '$/hooks/useEditMembersModal'
import useRoomPropertiesModal from '$/hooks/useRoomPropertiesModal'
import { Flag } from '$/features/flag/types'
import { useDispatch } from 'react-redux'
import { FlagAction } from '$/features/flag'
import {
    useDelegatedAccount,
    useDelegatedClient,
    useIsDelegatingAccess,
    useRequestPrivateKey,
} from '$/features/delegation/hooks'
import MessageInputPlaceholder from '$/components/Conversation/MessageInputPlaceholder'
import { ButtonHTMLAttributes, HTMLAttributes } from 'react'
import SecondaryButton from '$/components/SecondaryButton'
import Text from '$/components/Text'
import Spinner from '$/components/Spinner'
import { useWalletAccount } from '$/features/wallet/hooks'
import { PrivacySetting } from '$/types'
import useIsDelegatedAccountBeingPromoted from '$/hooks/useIsDelegatedAccountBeingPromoted'
import usePromoteDelegatedAccount from '$/hooks/usePromoteDelegatedAccount'

export default function Conversation() {
    const messages = useMessages()

    const { open: openAddMemberModal, modal: addMemberModal } = useAddMemberModal()

    const { open: openEditMembersModal, modal: editMembersModal } = useEditMembersModal()

    const { open: openRoomPropertiesModal, modal: roomPropertiesModal } = useRoomPropertiesModal()

    const canGrant = useCanGrant()

    const selectedRoomId = useSelectedRoomId()

    const resends = useResends(selectedRoomId)

    useResendEffect(selectedRoomId)

    const account = useDelegatedAccount()

    const client = useDelegatedClient()

    const mainAccount = useWalletAccount()

    const canMainPublish = useAbility(selectedRoomId, mainAccount, StreamPermission.PUBLISH)

    const canMainGrant = useAbility(selectedRoomId, mainAccount, StreamPermission.GRANT)

    const canPublish = useAbility(selectedRoomId, account, StreamPermission.PUBLISH)

    const canAct = !client ? canMainPublish : canPublish || canMainGrant

    const dispatch = useDispatch()

    return (
        <>
            {addMemberModal}
            {editMembersModal}
            {roomPropertiesModal}
            <ConversationHeader
                canModifyMembers={canGrant}
                onAddMemberClick={() => void openAddMemberModal()}
                onEditMembersClick={() => void openEditMembersModal()}
                onRoomPropertiesClick={() => void openRoomPropertiesModal()}
                onGoBackClick={() => void dispatch(FlagAction.set(Flag.isDisplayingRooms()))}
            />
            <div
                css={[
                    tw`
                        h-full
                        pt-[72px]
                        lg:pt-[92px]
                    `,
                    canAct &&
                        tw`
                            pb-[80px]
                            lg:pb-[96px]
                        `,
                ]}
            >
                <div css={tw`h-full`}>
                    {(messages || []).length ? (
                        <div
                            css={tw`
                                h-full
                                flex
                                flex-col
                            `}
                        >
                            <div css={tw`grow`} />
                            <MessageFeed messages={messages} resends={resends} />
                        </div>
                    ) : (
                        <EmptyMessageFeed
                            canModifyMembers={canGrant}
                            onAddMemberClick={() => void openAddMemberModal()}
                        />
                    )}
                </div>
            </div>
            {!client ? (
                canMainPublish && <DelegationBox />
            ) : canPublish ? (
                <Wrap>
                    <MessageInput streamrClient={client} />
                </Wrap>
            ) : (
                canMainGrant && <PermitBox />
            )}
        </>
    )
}

function Wrap(props: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            {...props}
            css={tw`
                shadow-[inset 0 1px 0 #dee6ee]
                absolute
                p-4
                lg:p-6
                bottom-0
                left-0
                w-full
            `}
        />
    )
}

function PermitBox() {
    const isPromoting = useIsDelegatedAccountBeingPromoted()

    const promote = usePromoteDelegatedAccount()

    return (
        <Wrap>
            <MessageInputPlaceholder
                cta={
                    <Cta busy={isPromoting} disabled={isPromoting} onClick={promote}>
                        {isPromoting ? <>Enabling…</> : <>Enable</>}
                    </Cta>
                }
            >
                Use your hot wallet to sign messages in this room.
            </MessageInputPlaceholder>
        </Wrap>
    )
}

function DelegationBox() {
    const isDelegatingAccess = useIsDelegatingAccess()

    const requestPrivateKey = useRequestPrivateKey()

    const roomId = useSelectedRoomId()

    const actions = usePrivacy(roomId) === PrivacySetting.Public ? 'send' : 'send and receive'

    return (
        <Wrap>
            <MessageInputPlaceholder
                cta={
                    <Cta
                        busy={isDelegatingAccess}
                        disabled={isDelegatingAccess}
                        onClick={requestPrivateKey}
                    >
                        {isDelegatingAccess ? <>Enabling…</> : <>Enable</>}
                    </Cta>
                }
            >
                Activate hot wallet signing to {actions} messages.
            </MessageInputPlaceholder>
        </Wrap>
    )
}

type CtaProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    busy?: boolean
}

function Cta({ children, busy = false, ...props }: CtaProps) {
    return (
        <SecondaryButton {...props} css={tw`text-[0.875rem] h-8 px-4`}>
            <div
                css={tw`
                    flex
                    items-center
                `}
            >
                <div>
                    <Text>{children}</Text>
                </div>
                {busy && (
                    <div
                        css={tw`
                            ml-2
                            relative
                            w-4
                            h-4
                        `}
                    >
                        <Spinner r={5} strokeWidth={1} />
                    </div>
                )}
            </div>
        </SecondaryButton>
    )
}
