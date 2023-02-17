import tw from 'twin.macro'
import { format } from 'date-fns'
import Text from '../Text'
import AddMemberIcon from '$/icons/AddMemberIcon'
import trunc from '$/utils/trunc'
import UtilityButton from '../UtilityButton'
import useSelectedRoom from '$/hooks/useSelectedRoom'
import useDisplayUsername from '$/hooks/useDisplayUsername'
import useJustInvited from '$/hooks/useJustInvited'
import { useSelectedRoomId } from '$/features/room/hooks'
import { useWalletAccount } from '$/features/wallet/hooks'
import useAcceptInvite from '$/hooks/useAcceptInvite'
import useIsInviteBeingAccepted from '$/hooks/useIsInviteBeingAccepted'
import Spinner from '$/components/Spinner'
import useAbility from '$/hooks/useAbility'
import { StreamPermission } from 'streamr-client'
import useAnonAccount from '$/hooks/useAnonAccount'

type Props = {
    onAddMemberClick?: () => void
}

export default function EmptyMessageFeed({ onAddMemberClick }: Props) {
    const roomId = useSelectedRoomId()

    const walletAccount = useWalletAccount()

    const isPublic = useAbility(roomId, useAnonAccount(roomId), StreamPermission.SUBSCRIBE)

    const canGrant = !!useAbility(roomId, walletAccount, StreamPermission.GRANT)

    const invited = useJustInvited(useSelectedRoomId(), walletAccount)

    if (typeof isPublic === 'undefined') {
        return null
    }

    return (
        <div
            css={[
                tw`
                    items-center
                    text-[#59799c]
                    flex
                    flex-col
                    h-full
                    justify-center
                    overflow-hidden
                    pt-4
                `,
            ]}
        >
            {isPublic ? null : (
                <>
                    <div
                        css={tw`
                            block
                            tracking-[0.02em]
                            mb-8
                            empty:hidden
                            px-16
                        `}
                    >
                        <Credits />
                    </div>
                    {invited ? (
                        <JoinButton />
                    ) : (
                        <UtilityButton
                            disabled={!canGrant}
                            onClick={onAddMemberClick}
                            css={tw`
                                flex
                                items-center
                            `}
                        >
                            <div tw="mr-2">
                                <AddMemberIcon />
                            </div>
                            <div tw="grow">
                                <Text>Add member</Text>
                            </div>
                        </UtilityButton>
                    )}
                </>
            )}
        </div>
    )
}

function Credits() {
    const { createdAt, createdBy } = useSelectedRoom() || {}

    const displayName = useDisplayUsername(createdBy, {
        fallback: 'Someone',
    })

    if (createdAt) {
        return (
            <>
                <span
                    css={[
                        !!createdBy &&
                            tw`
                                font-medium
                                break-all
                            `,
                    ]}
                >
                    {displayName}
                </span>{' '}
                created this room on {format(createdAt, 'iiii, LLL do yyyy')}.
            </>
        )
    }

    if (createdBy) {
        return (
            <>
                Room created by <span tw="font-medium">{trunc(createdBy)}</span>.
            </>
        )
    }

    return null
}

function JoinButton() {
    const acceptInvite = useAcceptInvite()

    const accepting = useIsInviteBeingAccepted()

    return (
        <UtilityButton
            disabled={accepting}
            onClick={() => void acceptInvite()}
            css={tw`
                flex
                items-center
            `}
        >
            <Text>{accepting ? <>Joining…</> : <>Join</>}</Text>
            {accepting && (
                <div
                    css={tw`
                        relative
                        w-4
                        h-4
                        ml-3
                    `}
                >
                    <Spinner strokeColor="currentColor" />
                </div>
            )}
        </UtilityButton>
    )
}
