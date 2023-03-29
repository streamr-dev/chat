import tw from 'twin.macro'
import Page from '$/components/Page'
import Conversation from '$/components/Conversation'
import Nav from '$/components/Nav'
import { useWalletAccount } from '$/features/wallet/hooks'
import UtilityButton from '$/components/UtilityButton'
import Text from '$/components/Text'
import useSelectedRoom from '$/hooks/useSelectedRoom'
import { useDispatch } from 'react-redux'
import useListenForInvitesEffect from '$/hooks/useListenForInvitesEffect'
import { RoomAction } from '$/features/room'
import { Flag } from '$/features/flag/types'
import useDetectMembersEffect from '$/hooks/useDetectMembersEffect'
import usePreselectRoomEffect from '$/hooks/usePreselectRoomEffect'
import useFlag from '$/hooks/useFlag'
import ArrowIcon from '$/icons/ArrowIcon'
import { FlagAction } from '$/features/flag'
import ActionButton from '$/components/ActionButton'
import Sidebar from '$/components/Sidebar'
import i18n from '$/utils/i18n'
import { MiscAction } from '$/features/misc'

export default function ChatPage() {
    const selectedRoom = useSelectedRoom()

    const dispatch = useDispatch()

    const account = useWalletAccount()

    useListenForInvitesEffect(account, (roomId, invitee) => {
        dispatch(
            RoomAction.registerInvite({
                roomId,
                invitee,
                fingerprint: Flag.isInviteBeingRegistered(roomId, invitee),
            })
        )
    })

    useDetectMembersEffect()

    usePreselectRoomEffect()

    const isDisplayingRooms = useFlag(Flag.isDisplayingRooms())

    return (
        <Page title={i18n('common.chatPageTitle')}>
            <Nav onAccountClick={() => void dispatch(MiscAction.showAccountModal())} />
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
                        onAddRoomButtonClick={() => void dispatch(MiscAction.showAddRoomModal())}
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
                                            void dispatch(FlagAction.set(Flag.isDisplayingRooms()))
                                        }
                                    >
                                        <ArrowIcon />
                                    </ActionButton>
                                    <UtilityButton
                                        onClick={() => void dispatch(MiscAction.showAddRoomModal())}
                                    >
                                        <Text>{i18n('common.addNewRoomLabel')}</Text>
                                    </UtilityButton>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </Page>
    )
}
