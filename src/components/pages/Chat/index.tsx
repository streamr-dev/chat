import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import tw from 'twin.macro'
import Page from '../../Page'
import WalletModal from '../../modals/WalletModal'
import AccountModal from '../../modals/AccountModal'
import AddRoomButton from './AddRoomButton'
import AddRoomModal from '../../modals/AddRoomModal'
import Conversation from '../../Conversation'
import Nav from './Nav'
import RoomButton from './RoomButton'
import { useWalletAccount } from '../../../features/wallet/hooks'
import UtilityButton from '../../UtilityButton'
import Text from '../../Text'
import useRooms from '../../../hooks/useRooms'
import useSelectedRoom from '../../../hooks/useSelectedRoom'
import { useDispatch } from 'react-redux'
import useProviderChangeEffect from '../../../hooks/useProviderChangeEffect'
import { RoomsAction } from '../../../features/rooms'

function UnwrappedChat() {
    const [accountModalOpen, setAccountModalOpen] = useState<boolean>(false)

    const [walletModalOpen, setWalletModalOpen] = useState<boolean>(false)

    const [roomModalOpen, setRoomModalOpen] = useState<boolean>(false)

    function toggleWalletModal(state: boolean) {
        setWalletModalOpen(state)

        if (state === false) {
            setAccountModalOpen(true)
        }
    }

    const selectedRoom = useSelectedRoom()

    const rooms = useRooms()

    const dispatch = useDispatch()

    const account = useWalletAccount()

    useEffect(() => {
        if (account) {
            dispatch(RoomsAction.fetch())
        }
    }, [dispatch, account])

    useProviderChangeEffect()

    return (
        <>
            <Page title="Let's chat!">
                <Nav onAccountClick={() => void setAccountModalOpen(true)} />
                <main
                    css={[
                        tw`
                            w-screen
                            h-screen
                            p-10
                            pt-[91px]
                        `,
                    ]}
                >
                    <div
                        css={[
                            tw`
                                w-full
                                h-full
                                relative
                            `,
                        ]}
                    >
                        <aside
                            css={[
                                tw`
                                    h-full
                                    w-[22rem]
                                    overflow-auto
                                    [button + button]:mt-4
                                `,
                            ]}
                        >
                            <AddRoomButton onClick={() => void setRoomModalOpen(true)} />
                            {(rooms || []).map((room) => (
                                <RoomButton
                                    key={room.id}
                                    active={selectedRoom && selectedRoom.id === room.id}
                                    room={room}
                                />
                            ))}
                        </aside>
                        <div
                            css={[
                                tw`
                                    bg-white
                                    rounded-[20px]
                                    absolute
                                    bottom-0
                                    left-[24rem]
                                    right-0
                                    top-0
                                `,
                            ]}
                        >
                            {selectedRoom ? (
                                <Conversation />
                            ) : (
                                <div
                                    css={[
                                        tw`
                                            h-full
                                            w-full
                                            flex
                                            flex-col
                                            items-center
                                            justify-center
                                        `,
                                    ]}
                                >
                                    <UtilityButton onClick={() => void setRoomModalOpen(true)}>
                                        <Text>Add new room</Text>
                                    </UtilityButton>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </Page>
            <AccountModal
                open={accountModalOpen}
                setOpen={setAccountModalOpen}
                onChangeClick={() => {
                    setAccountModalOpen(false)
                    setWalletModalOpen(true)
                }}
            />
            <WalletModal open={walletModalOpen} setOpen={toggleWalletModal} />
            <InvitationListener />
            <AddRoomModal open={roomModalOpen} setOpen={setRoomModalOpen} />
        </>
    )
}

export default function Chat() {
    const account = useWalletAccount()

    const navigate = useNavigate()

    useEffect(() => {
        if (account === null) {
            navigate('/')
        }
    }, [navigate, account])

    // No account? Render nothing and wait. The above `useEffect` will
    // take us places.
    if (!account) {
        return null
    }

    return <UnwrappedChat />
}

function InvitationListener() {
    return null
}
