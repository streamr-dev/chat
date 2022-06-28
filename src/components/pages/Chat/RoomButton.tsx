import { ButtonHTMLAttributes, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import tw from 'twin.macro'
import { PermissionAction } from '$/features/permission'
import { RoomAction } from '$/features/room'
import { IRoom } from '$/features/room/types'
import { useWalletAccount, useWalletClient } from '$/features/wallet/hooks'
import useEmitPresenceEffect from '$/hooks/useEmitPresenceEffect'
import useIntercept from '$/hooks/useIntercept'
import useJustInvited from '$/hooks/useJustInvited'
import useRecentMessage from '$/hooks/useRecentMessage'
import Avatar from '../../Avatar'
import SidebarButton from '../../SidebarButton'
import Text from '../../Text'
import { PreferencesAction } from '$/features/preferences'
import useIsRoomVisible from '$/hooks/useIsRoomVisible'
import useIsRoomPinned from '$/hooks/useIsRoomPinned'
import { Flag } from '$/features/flag/types'
import PinIcon from '$/icons/PinIcon'

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'children'> & {
    active?: boolean
    room: IRoom
}

export default function RoomButton({ room, active, ...props }: Props) {
    const recentMessage = useRecentMessage(room.id)?.content

    const dispatch = useDispatch()

    const { id, name } = room

    const requester = useWalletAccount()

    const streamrClient = useWalletClient()

    useEffect(() => {
        if (!requester || !streamrClient) {
            return
        }

        dispatch(
            RoomAction.sync({
                roomId: id,
                requester,
                streamrClient,
                fingerprint: Flag.isSyncingRoom(id),
            })
        )
    }, [dispatch, id, requester])

    useIntercept(id)

    useEmitPresenceEffect(id)

    const address = useWalletAccount()

    useEffect(() => {
        if (!address || !streamrClient) {
            return
        }

        dispatch(
            PermissionAction.fetchAll({
                roomId: id,
                address,
                streamrClient,
                fingerprint: Flag.isFetchingAllPermissions(id, address),
            })
        )
    }, [id, address, streamrClient])

    const justInvited = useJustInvited(id, address)

    const isVisible = useIsRoomVisible(id)

    const isPinned = useIsRoomPinned(id)

    return (
        <SidebarButton
            {...props}
            active={active}
            icon={<Icon id={id} />}
            onClick={() => {
                if (!address) {
                    return
                }

                dispatch(
                    PreferencesAction.set({
                        owner: address,
                        selectedRoomId: id,
                    })
                )
            }}
            misc={
                <>
                    <div
                        css={[
                            tw`
                            text-[#59799C]
                            flex
                            items-center
                            ml-2

                            empty:hidden
                            [* + *]:ml-3
                        `,
                        ]}
                    >
                        {justInvited && (
                            <div
                                css={[
                                    tw`
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
                                    `,
                                ]}
                            >
                                <Text>Invite</Text>
                            </div>
                        )}
                        {isPinned && <PinIcon />}
                        {!isVisible && (
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
                    css={[
                        tw`
                            text-black
                            truncate
                        `,
                    ]}
                >
                    {name || 'Unnamed room'}
                </div>
                {typeof recentMessage !== 'undefined' && (
                    <div
                        css={[
                            tw`
                                text-[#59799C]
                                text-[14px]
                                font-plex
                            `,
                        ]}
                    >
                        <Text tw="truncate">{recentMessage}</Text>
                    </div>
                )}
            </div>
        </SidebarButton>
    )
}

function Icon({ id: roomId }: Pick<Props['room'], 'id'>) {
    return (
        <div tw="p-1">
            <Avatar seed={roomId} backgroundColor="white" />
        </div>
    )
}
