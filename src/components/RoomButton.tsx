import { ReactNode, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import tw from 'twin.macro'
import { PermissionsAction } from '$/features/permissions'
import { RoomAction } from '$/features/room'
import { IRoom, RoomId } from '$/features/room/types'
import { useWalletAccount } from '$/features/wallet/hooks'
import useIntercept from '$/hooks/useIntercept'
import useJustInvited from '$/hooks/useJustInvited'
import useRecentMessage from '$/hooks/useRecentMessage'
import Avatar from './Avatar'
import SidebarButton from './SidebarButton'
import Text from './Text'
import useIsRoomVisible from '$/hooks/useIsRoomVisible'
import useIsRoomPinned from '$/hooks/useIsRoomPinned'
import { Flag } from '$/features/flag/types'
import PinIcon from '$/icons/PinIcon'
import useAgo from '$/hooks/useAgo'
import isSameAddress from '$/utils/isSameAddress'
import { Link, LinkProps } from 'react-router-dom'
import pathnameToRoomIdPartials from '$/utils/pathnameToRoomIdPartials'
import { FlagAction } from '$/features/flag'
import { stickyRoomIds } from '$/config.json'
import i18n from '$/utils/i18n'

const stickyRoomSubtitle = stickyRoomIds.reduce<Partial<Record<RoomId, string>>>(
    (memo, { id, ...rest }) => {
        if ('subtitle' in rest && typeof rest.subtitle === 'string') {
            memo[id] = rest.subtitle
        }

        return memo
    },
    {}
)

interface Props extends Omit<LinkProps, 'children' | 'to'> {
    active?: boolean
    room: IRoom
}

export default function RoomButton({ room, active, ...props }: Props) {
    const recentMessage = useRecentMessage(room.id)

    const dispatch = useDispatch()

    const { id, name } = room

    const requester = useWalletAccount()

    useEffect(() => {
        if (!requester) {
            return
        }

        dispatch(
            RoomAction.sync({
                roomId: id,
                requester,
                fingerprint: Flag.isSyncingRoom(id),
            })
        )
    }, [dispatch, id, requester])

    useIntercept(id)

    const address = useWalletAccount()

    useEffect(() => {
        if (!address) {
            return
        }

        dispatch(
            PermissionsAction.fetchPermissions({
                roomId: id,
                address,
                fingerprint: Flag.isFetchingAllPermissions(id, address),
            })
        )
    }, [id, address])

    const justInvited = useJustInvited(id, address)

    const isVisible = useIsRoomVisible(id)

    const isPinned = useIsRoomPinned(id)

    const ago = useAgo(recentMessage?.createdAt)

    const seen = isSameAddress(recentMessage?.createdBy, address) || Boolean(recentMessage?.seenAt)

    return (
        <PassiveRoomButton
            {...props}
            active={active}
            pinned={isPinned}
            roomId={id}
            roomName={name}
            tagLabel={justInvited ? i18n('common.inviteLabel') : undefined}
            visible={isVisible}
            desc={
                stickyRoomSubtitle[id] || (
                    <>
                        {typeof recentMessage?.content !== 'undefined' && (
                            <>
                                <div css={tw`min-w-0`}>
                                    <Text truncate css={!seen && tw`font-bold`}>
                                        {recentMessage?.content}
                                    </Text>
                                </div>
                                {typeof ago !== 'undefined' && (
                                    <>
                                        <div css={tw`px-1`}>
                                            <Text>·</Text>
                                        </div>
                                        <div>
                                            <Text>{ago}</Text>
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                    </>
                )
            }
        />
    )
}

interface PassiveRoomButtonProps extends Omit<LinkProps, 'children' | 'to'> {
    active?: boolean
    desc?: ReactNode
    pinned?: boolean
    roomId: RoomId
    roomName: string
    tagLabel?: string
    visible?: boolean
}

export function PassiveRoomButton({
    active = false,
    desc,
    onClick,
    pinned = false,
    roomId,
    roomName,
    tagLabel,
    visible = false,
    ...props
}: PassiveRoomButtonProps) {
    const dispatch = useDispatch()

    const partials = pathnameToRoomIdPartials(roomId)

    const url =
        typeof partials === 'string' ? `/${partials}` : `/${partials.account}~${partials.uuid}`

    const account = useWalletAccount()

    return (
        <SidebarButton
            {...props}
            tag={Link}
            active={active}
            icon={<Icon id={roomId} />}
            to={url}
            onClick={(e) => {
                dispatch(FlagAction.unset(Flag.isDisplayingRooms()))

                onClick?.(e)

                if (!account) {
                    return
                }

                dispatch(
                    RoomAction.preselect({
                        roomId,
                        account,
                        fingerprint: Flag.isPreselectingRoom(roomId),
                    })
                )
            }}
            css={tw`
                h-20
                lg:h-[92px]
            `}
            misc={
                <>
                    <div
                        css={tw`
                            text-[#59799C]
                            flex
                            items-center
                            ml-2
                            empty:hidden
                            [* + *]:ml-3
                        `}
                    >
                        {!!tagLabel && (
                            <div
                                css={tw`
                                    bg-[#E0E7F2]
                                    text-[#59799C]
                                    text-[0.625rem]
                                    font-medium
                                    tracking-wider
                                    uppercase
                                    w-max
                                    px-3
                                    py-1
                                    rounded-full
                                `}
                            >
                                <Text>{tagLabel}</Text>
                            </div>
                        )}
                        {pinned && <PinIcon />}
                        {!visible && (
                            <svg
                                width="14"
                                height="11"
                                viewBox="0 0 14 11"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M13.085 5.068c-.017-.044-.481-1.072-1.51-2.105C10.204 1.595 8.47.868 6.562.868a7.24 7.24 0 0 0-1.203.098.443.443 0 0 0-.252.728l5.54 6.092a.437.437 0 0 0 .322.142.47.47 0 0 0 .296-.11c1.247-1.12 1.8-2.345 1.82-2.395a.447.447 0 0 0 0-.355zM2.509.135a.438.438 0 0 0-.646.59l1.05 1.155C.928 3.1.075 4.98.037 5.068a.448.448 0 0 0 0 .355c.016.039.481 1.067 1.51 2.1C2.918 8.891 4.651 9.618 6.56 9.618a6.94 6.94 0 0 0 2.85-.59l1.202 1.323a.438.438 0 1 0 .646-.59L2.509.134zM6.56 7.212a1.969 1.969 0 0 1-1.613-3.096l2.58 2.839a1.938 1.938 0 0 1-.967.257z"
                                    fill="currentColor"
                                />
                            </svg>
                        )}
                    </div>
                </>
            }
        >
            <div>
                <div
                    css={tw`
                        text-black
                        truncate
                    `}
                >
                    {roomName || i18n('common.fallbackRoomName')}
                </div>
                <div
                    css={tw`
                        text-[#59799C]
                        text-[14px]
                        font-plex
                        flex
                        items-center
                        min-w-0
                        empty:hidden
                    `}
                >
                    {desc}
                </div>
            </div>
        </SidebarButton>
    )
}

function Icon({ id: roomId }: Pick<Props['room'], 'id'>) {
    return (
        <div css={tw`p-1`}>
            <Avatar seed={roomId} backgroundColor="white" />
        </div>
    )
}
