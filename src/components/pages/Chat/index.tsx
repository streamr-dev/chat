import Helmet from 'react-helmet'
import styled from 'styled-components'
import ChatWindow from './ChatWindow'
import RoomList from './RoomList'
import Navbar from '../../Navbar'
import RoomItem from './RoomItem'
import Background from '../Home/background.png'
import Message from './Message'
import { ActionType, useDispatch, useMessages, useStore } from '../../Store'
import { fetchRooms } from '../../../lib/ChatRoomManager'
import { useEffect, useState } from 'react'
import { detectTypedEthereumProvider } from '../../../lib/MetamaskDelegatedAccess'
import { ChatRoom } from '../../../utils/types'

const Content = styled.div`
    height: 100vh;
    padding: 91px 40px 40px; /* 91px is Navbar's height. */
    width: 100vw;

    > div {
        height: 100%;
        position: relative;
        width: 100%;
    }
`

type Props = {
    className?: string
}

const UnstyledChat = ({ className }: Props) => {
    const messages = useMessages()
    const { roomId, rooms, metamaskAddress, session } = useStore()
    const dispatch = useDispatch()

    useEffect(() => {
        if (!session.streamrClient) {
            // No streamr client. Skip.
            return
        }
        const fn = async () => {
            // the callback allows for rooms to be rendered as soon as they're fetched
            // opposed to waiting for them all to arrive and then render
            await fetchRooms(
                session.streamrClient!,
                session.wallet!.address,
                session.provider!,
                (chatRoom: ChatRoom) => {
                    dispatch({
                        type: ActionType.AddRooms,
                        payload: [chatRoom],
                    })
                }
            )
        }

        fn()
    }, [metamaskAddress, session])

    return (
        <>
            <Helmet title="Let's chat!" />
            <main className={className}>
                <Navbar />
                <Content>
                    <div>
                        <RoomList>
                            {rooms.map((room) => (
                                <RoomItem
                                    key={room.id}
                                    id={room.id}
                                    active={room.id === roomId}
                                    name={room.name}
                                    unread={false}
                                />
                            ))}
                        </RoomList>
                        <ChatWindow>
                            {messages.map((message) => (
                                <Message key={message.id} payload={message} />
                            ))}
                        </ChatWindow>
                    </div>
                </Content>
            </main>
        </>
    )
}

const Chat = styled(UnstyledChat)`
    background-attachment: fixed;
    background-image: url(${Background});
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    height: 100vh;
    width: 100vw;
`

export default Chat
