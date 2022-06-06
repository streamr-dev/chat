import { ButtonHTMLAttributes, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import tw from 'twin.macro'
import { RoomAction } from '../../../features/room'
import { IRoom } from '../../../features/room/types'
import useEmitPresenceEffect from '../../../hooks/useEmitPresenceEffect'
import useIntercept from '../../../hooks/useIntercept'
import useRecentMessage from '../../../hooks/useRecentMessage'
import Avatar from '../../Avatar'
import SidebarButton from '../../SidebarButton'
import Text from '../../Text'

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'children'> & {
    active?: boolean
    room: IRoom
}

export default function RoomButton({ room, active, ...props }: Props) {
    const recentMessage = useRecentMessage(room.id)?.content

    const dispatch = useDispatch()

    const { id, name } = room

    useEffect(() => {
        dispatch(RoomAction.sync(id))
    }, [dispatch, id])

    useIntercept(id)

    useEmitPresenceEffect(id)

    return (
        <SidebarButton
            {...props}
            active={active}
            icon={<Icon id={id} />}
            onClick={() => void dispatch(RoomAction.select(id))}
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
            <Avatar account={roomId} backgroundColor="white" />
        </div>
    )
}
