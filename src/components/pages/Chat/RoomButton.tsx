import { ButtonHTMLAttributes } from 'react'
import tw from 'twin.macro'
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
    const roomName = undefined

    const recentMessage = undefined

    return (
        <SidebarButton
            {...props}
            active={roomId === 'ROOM_ID'}
            icon={<Icon roomId={roomId} />}
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
