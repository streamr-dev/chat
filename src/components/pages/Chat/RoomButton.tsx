import { ButtonHTMLAttributes } from 'react'
import { useDispatch } from 'react-redux'
import tw from 'twin.macro'
import { selectRoom } from '../../../features/rooms/actions'
import {
    useRoomName,
    useRoomRecentMessage,
    useSelectedRoomId,
} from '../../../features/rooms/hooks'
import getIdenticon from '../../../getters/getIdenticon'
import SidebarButton from '../../SidebarButton'
import Text from '../../Text'

type Props = Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'type' | 'children'
> & {
    roomId: string
}

export default function RoomButton({ roomId, ...props }: Props) {
    const roomName = useRoomName(roomId)

    const recentMessage = useRoomRecentMessage(roomId)

    const active = roomId === useSelectedRoomId()

    const dispatch = useDispatch()

    return (
        <SidebarButton
            {...props}
            active={active}
            icon={<Icon roomId={roomId} />}
            onClick={() => void dispatch(selectRoom(roomId))}
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
                    {roomName || 'Unnamed room'}
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

function Icon({ roomId }: Pick<Props, 'roomId'>) {
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
