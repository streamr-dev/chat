import { useEffect } from 'react'
import tw from 'twin.macro'
import Page from '$/components/Page'
import Conversation from '$/components/Conversation'
import Nav from '$/components/Nav'
import { useWalletAccount, useWalletClient } from '$/features/wallet/hooks'
import UtilityButton from '$/components/UtilityButton'
import Text from '$/components/Text'
import useSelectedRoom from '$/hooks/useSelectedRoom'
import { useDispatch } from 'react-redux'
import { RoomsAction } from '$/features/rooms'
import useListenForInvitesEffect from '$/hooks/useListenForInvitesEffect'
import { RoomAction } from '$/features/room'
import { Flag } from '$/features/flag/types'
import useDetectMembersEffect from '$/hooks/useDetectMembersEffect'
import useAccountModal from '$/hooks/useAccountModal'
import useAddRoomModal from '$/hooks/useAddRoomModal'
import usePreselectRoomEffect from '$/hooks/usePreselectRoomEffect'
import useFlag from '$/hooks/useFlag'
import ArrowIcon from '$/icons/ArrowIcon'
import { FlagAction } from '$/features/flag'
import ActionButton from '$/components/ActionButton'
import Sidebar from '$/components/Sidebar'
import { I18n } from '$/utils/I18n'

export default function ChatPage() {
    const { open: openAccountModal, modal: accountModal } = useAccountModal()

    const { open: openAddRoomModal, modal: addRoomModal } = useAddRoomModal()

    const selectedRoom = useSelectedRoom()

    const dispatch = useDispatch()

    const account = useWalletAccount()

    const streamrClient = useWalletClient()

    useEffect(() => {
        if (!account || !streamrClient) {
            return
        }

        dispatch(
            RoomsAction.fetch({
                requester: account,
                streamrClient,
            })
        )
    }, [dispatch, account, streamrClient])

    useListenForInvitesEffect(account, (roomId, invitee) => {
        if (!streamrClient) {
            return
        }

        dispatch(
            RoomAction.registerInvite({
                roomId,
                invitee,
                streamrClient,
                fingerprint: Flag.isInviteBeingRegistered(roomId, invitee),
            })
        )
    })

    useDetectMembersEffect()

    usePreselectRoomEffect()

    const isDisplayingRooms = useFlag(Flag.isDisplayingRooms())

    return (
        <>
            {accountModal}
            {addRoomModal}
            <Page title={I18n.common.chatPageTitle()}>
                <Nav onAccountClick={() => void openAccountModal()} />
                <main
                    css={tw`
                        w-screen
                        h-screen
                        md:p-10
                        pt-20
                        md:pt-24
                    `}
                >
                    <div
                        css={tw`
                            w-full
                            h-full
                            relative
                        `}
                    >
                        <Sidebar
                            css={isDisplayingRooms && tw`block`}
                            onAddRoomButtonClick={openAddRoomModal}
                        />
                        <div
                            css={[
                                tw`
                                    md:block
                                    bg-white
                                    rounded-t-[10px]
                                    md:rounded-[20px]
                                    absolute
                                    bottom-0
                                    left-0
                                    md:left-[19rem]
                                    lg:left-[24rem]
                                    right-0
                                    top-0
                                `,
                                isDisplayingRooms && tw`hidden`,
                            ]}
                        >
                            {selectedRoom ? (
                                <Conversation />
                            ) : (
                                <div
                                    css={tw`
                                        h-full
                                        w-full
                                        flex
                                        flex-col
                                        items-center
                                        justify-center
                                    `}
                                >
                                    <div css={tw`flex`}>
                                        <ActionButton
                                            css={tw`
                                                block
                                                md:hidden
                                                h-14
                                                w-14
                                                mr-4
                                            `}
                                            onClick={() =>
                                                void dispatch(
                                                    FlagAction.set(Flag.isDisplayingRooms())
                                                )
                                            }
                                        >
                                            <ArrowIcon />
                                        </ActionButton>
                                        <UtilityButton onClick={() => void openAddRoomModal()}>
                                            <Text>{I18n.common.addNewRoomLabel()}</Text>
                                        </UtilityButton>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </Page>
        </>
    )
}
