import Form from '$/components/Form'
import RoomButton, { PassiveRoomButton } from '$/components/RoomButton'
import SidebarUtilityButton, { SidebarUtilityButtonType } from '$/components/SidebarUtilityButton'
import Text from '$/components/Text'
import { Flag } from '$/features/flag/types'
import { MiscAction } from '$/features/misc'
import { RoomAction } from '$/features/room'
import { RoomId } from '$/features/room/types'
import { useWalletClient } from '$/features/wallet/hooks'
import useFlag from '$/hooks/useFlag'
import useKnownTokens from '$/hooks/useKnownTokens'
import useRooms from '$/hooks/useRooms'
import useSearchResult from '$/hooks/useSearchResult'
import useSelectedRoom from '$/hooks/useSelectedRoom'
import ArrowIcon from '$/icons/ArrowIcon'
import isBlank from '$/utils/isBlank'
import isSameAddress from '$/utils/isSameAddress'
import { HTMLAttributes, useEffect, useMemo, useState } from 'react'
import { useDispatch } from 'react-redux'
import tw from 'twin.macro'

interface Props extends HTMLAttributes<HTMLElement> {
    onAddRoomButtonClick?: () => void
}

export default function Sidebar({ onAddRoomButtonClick, ...props }: Props) {
    const rooms = useRooms()

    const selectedRoom = useSelectedRoom()

    const [showSearch, setShowSearch] = useState(false)

    const [roomId, setRoomId] = useState<RoomId>(
        '0x9ce0e18d6e7497a3c77e2d23ffa18241540a6667/streamr-chat/room/trollbox'
    )

    const searchResult = useSearchResult(roomId)

    const isSearching = useFlag(Flag.isSearching())

    const knownTokens = useKnownTokens()

    const tokenAddress = searchResult?.tokenAddress

    const gated = !!tokenAddress

    const dispatch = useDispatch()

    useEffect(() => {
        if (gated) {
            dispatch(MiscAction.fetchKnownTokens())
        }
    }, [gated])

    const knownToken = useMemo(() => {
        if (!tokenAddress || !knownTokens.length) {
            return undefined
        }

        return knownTokens.find(({ address }) => isSameAddress(address, tokenAddress))
    }, [knownTokens, tokenAddress])

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
            {showSearch && (
                <>
                    <Search
                        roomId={roomId}
                        onRoomId={setRoomId}
                        onGoBackButtonClick={() => void setShowSearch(false)}
                    />
                    <Header>Search results</Header>
                    {isSearching || searchResult == null ? (
                        <div
                            css={[
                                tw`
                                    text-[14px]
                                    text-[#59799C]
                                    px-4
                                    flex
                                    items-center
                                    justify-center
                                    h-[92px]
                                    rounded-2xl
                                    mt-4
                                    relative
                                `,
                                isSearching && tw`animate-pulse`,
                            ]}
                        >
                            <Text>
                                {isSearching ? (
                                    <>Please wait…</>
                                ) : searchResult === null ? (
                                    <>Not found</>
                                ) : (
                                    <>No results</>
                                )}
                            </Text>
                        </div>
                    ) : (
                        <PassiveRoomButton
                            roomId={roomId}
                            roomName={searchResult.name}
                            desc={knownToken?.symbol}
                            visible
                            css={tw`mt-4`}
                            onClick={() => void setShowSearch(false)}
                        />
                    )}
                </>
            )}
            <div css={showSearch && tw`hidden`}>
                <SidebarUtilityButton
                    label="Find"
                    type={SidebarUtilityButtonType.Search}
                    onClick={() => void setShowSearch(true)}
                />
                <SidebarUtilityButton
                    onClick={() => void onAddRoomButtonClick?.()}
                    label="Add new room"
                    type={SidebarUtilityButtonType.Add}
                    css={tw`mt-2`}
                />
                <Header>Rooms</Header>
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

const Header = tw.h4`
    mt-6
    text-[12px]
    text-[#59799C]
    font-medium
    uppercase
    tracking-wider
`

interface SearchProps extends HTMLAttributes<HTMLDivElement> {
    onGoBackButtonClick?: () => void
    roomId: RoomId
    onRoomId: (roomId: RoomId) => void
}

function Search({ roomId, onRoomId, onGoBackButtonClick, ...props }: SearchProps) {
    const streamrClient = useWalletClient()

    const dispatch = useDispatch()

    const isSearching = useFlag(Flag.isSearching())

    return (
        <div {...props}>
            <Form
                css={tw`
                    flex
                    items-center
                `}
                onSubmit={() => {
                    if (isBlank(roomId) || !streamrClient) {
                        return
                    }

                    dispatch(
                        RoomAction.search({
                            roomId,
                            streamrClient,
                            fingerprint: Flag.isSearching(),
                        })
                    )
                }}
            >
                <button
                    type="button"
                    onClick={onGoBackButtonClick}
                    css={tw`
                        w-14
                        appearance-none
                        h-14
                        flex
                        items-center
                        justify-center
                    `}
                >
                    <ArrowIcon />
                </button>
                <input
                    readOnly={isSearching}
                    value={roomId}
                    onChange={({ target }) => void onRoomId(target.value)}
                    autoFocus
                    type="text"
                    placeholder="Room ID"
                    onKeyDown={(e) => {
                        if (e.key !== 'Escape') {
                            return
                        }

                        if (isBlank(roomId)) {
                            return void onGoBackButtonClick?.()
                        }

                        onRoomId('')
                    }}
                    css={tw`
                        text-black
                        rounded-2xl
                        h-14
                        w-full
                        outline-0
                        px-4
                        placeholder:text-[#59799C]
                    `}
                />
            </Form>
        </div>
    )
}
