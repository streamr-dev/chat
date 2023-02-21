import RoomButton from '$/components/RoomButton'
import SidebarUtilityButton, { SidebarUtilityButtonType } from '$/components/SidebarUtilityButton'
import useRooms from '$/hooks/useRooms'
import useSelectedRoom from '$/hooks/useSelectedRoom'
import { HTMLAttributes } from 'react'
import tw from 'twin.macro'

interface Props extends HTMLAttributes<HTMLElement> {
    onAddRoomButtonClick?: () => void
}

export default function Sidebar({ onAddRoomButtonClick, ...props }: Props) {
    const rooms = useRooms()

    const selectedRoom = useSelectedRoom()

    return (
        <aside
            {...props}
            css={tw`
                hidden
                md:block
                h-full
                w-full
                md:w-[18rem]
                lg:w-[22rem]
                p-4
                md:p-0
                overflow-auto
            `}
        >
            <div css={tw`[> * + *]:mt-2`}>
                <SidebarUtilityButton
                    onClick={() => void onAddRoomButtonClick?.()}
                    label="Add new room"
                    type={SidebarUtilityButtonType.Add}
                />
            </div>
            <div css={tw``}>
                <h4
                    css={tw`
                        mt-6
                        text-[12px]
                        text-[#59799C]
                        font-medium
                        uppercase
                        tracking-wider
                    `}
                >
                    Rooms
                </h4>
                {(rooms || []).map((room) => (
                    <RoomButton
                        key={room.id}
                        active={selectedRoom ? selectedRoom.id === room.id : false}
                        room={room}
                        css={tw`mt-4`}
                    />
                ))}
            </div>
        </aside>
    )
}
