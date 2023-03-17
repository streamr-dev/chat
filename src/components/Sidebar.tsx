import Form from '$/components/Form'
import RoomButton, { PassiveRoomButton } from '$/components/RoomButton'
import RoomInfo from '$/components/RoomInfo'
import SidebarUtilityButton, { SidebarUtilityButtonType } from '$/components/SidebarUtilityButton'
import Text from '$/components/Text'
import { Flag } from '$/features/flag/types'
import { RoomAction } from '$/features/room'
import { RoomId } from '$/features/room/types'
import { useWalletClient } from '$/features/wallet/hooks'
import useFlag from '$/hooks/useFlag'
import useRooms from '$/hooks/useRooms'
import useSearchResult from '$/hooks/useSearchResult'
import useSelectedRoom from '$/hooks/useSelectedRoom'
import ArrowIcon from '$/icons/ArrowIcon'
import { Prefix } from '$/types'
import i18n from '$/utils/i18n'
import isBlank from '$/utils/isBlank'
import pathnameToRoomIdPartials from '$/utils/pathnameToRoomIdPartials'
import { HTMLAttributes, useState } from 'react'
import { useDispatch } from 'react-redux'
import tw from 'twin.macro'

interface Props extends HTMLAttributes<HTMLElement> {
    onAddRoomButtonClick?: () => void
}

export default function Sidebar({ onAddRoomButtonClick, ...props }: Props) {
    const rooms = useRooms()

    const selectedRoom = useSelectedRoom()

    const [showSearch, setShowSearch] = useState(false)

    const [rawRoomId, setRawRoomId] = useState<RoomId>('')

    const partials = pathnameToRoomIdPartials(rawRoomId)

    const roomId =
        typeof partials === 'string'
            ? partials
            : `${partials.account}/${Prefix.Room}/${partials.uuid}`

    const searchResult = useSearchResult(roomId)

    const isSearching = useFlag(Flag.isSearching())

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
                        roomId={rawRoomId}
                        onRoomId={setRawRoomId}
                        onGoBackButtonClick={() => void setShowSearch(false)}
                    />
                    <Header>{i18n('search.resultLabel')}</Header>
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
                                {isSearching
                                    ? i18n('search.waitLabel')
                                    : searchResult === null
                                    ? i18n('search.notFoundLabel')
                                    : i18n('search.noResultsLabel')}
                            </Text>
                        </div>
                    ) : (
                        <PassiveRoomButton
                            roomId={roomId}
                            roomName={searchResult.name}
                            desc={<RoomInfo mini roomId={roomId} />}
                            visible
                            css={tw`mt-4`}
                            onClick={() => void setShowSearch(false)}
                        />
                    )}
                </>
            )}
            <div css={showSearch && tw`hidden`}>
                <SidebarUtilityButton
                    label={i18n('sidebar.findButtonLabel')}
                    type={SidebarUtilityButtonType.Search}
                    onClick={() => void setShowSearch(true)}
                />
                <SidebarUtilityButton
                    onClick={() => void onAddRoomButtonClick?.()}
                    label={i18n('common.addNewRoomLabel')}
                    type={SidebarUtilityButtonType.Add}
                    css={tw`mt-2`}
                />
                <Header>{i18n('sidebar.roomsLabel')}</Header>
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
                    placeholder={i18n('search.searchFieldPlaceholder')}
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
