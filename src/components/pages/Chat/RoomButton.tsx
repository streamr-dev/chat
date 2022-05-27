import { ButtonHTMLAttributes, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import tw from 'twin.macro'
import { selectRoom, syncRoom } from '../../../features/rooms/actions'
import { IRoom } from '../../../features/rooms/types'
import getIdenticon from '../../../getters/getIdenticon'
import useRecentMessage from '../../../hooks/useRecentMessage'
import SidebarButton from '../../SidebarButton'
import Text from '../../Text'

type Props = Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'type' | 'children'
> & {
    active?: boolean
    room: IRoom
}

export default function RoomButton({ room, active, ...props }: Props) {
    const recentMessage = useRecentMessage(room.id)?.content

    const dispatch = useDispatch()

    const { id, name } = room

    useEffect(() => {
        dispatch(syncRoom(id))
    }, [dispatch, id])

    return (
        <SidebarButton
            {...props}
            active={active}
            icon={<Icon id={id} />}
            onClick={() => void dispatch(selectRoom(id))}
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
                <div
                    css={[
                        tw`
                            text-[#59799C]
                            text-[14px]
                            font-plex
                        `,
                    ]}
                >
                    <Text tw="truncate">{recentMessage || 'Empty room'}</Text>
                </div>
            </div>
        </SidebarButton>
    )
}

function Icon({ id: roomId }: Pick<Props['room'], 'id'>) {
    return (
        <div
            css={[
                tw`
                    bg-white
                    w-12
                    h-12
                    p-2
                    overflow-hidden
                    rounded-full
                `,
            ]}
        >
            <img
                tw="block"
                src={`data:image/png;base64,${getIdenticon(roomId)}`}
                alt={roomId}
            />
        </div>
    )
}
