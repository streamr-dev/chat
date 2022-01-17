import Helmet from 'react-helmet'
import styled from 'styled-components'
import ChatWindow from './ChatWindow'
import RoomList from './RoomList'
import Navbar from '../../Navbar'
import RoomItem from './RoomItem'
import Background from '../Home/background.png'
import Message from './Message'
import { useMessages, useStore } from '../../Store'
import { ChatRoomManager } from '../../../lib/ChatRoomManager'
import { useEffect } from 'react'
import { detectTypedEthereumProvider } from '../../../lib/MetamaskDelegatedAccess'

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

    useEffect(() => {
        if (!session.streamrClient) {
            // No streamr client. Skip.
            return
        }

        const fn = async () => {
            const provider = await detectTypedEthereumProvider()

            const chatRoomManager = new ChatRoomManager(
                metamaskAddress,
                session.streamrClient!,
                provider
            )

            const foundRooms = await chatRoomManager.fetchRooms()
            for (const room of foundRooms) {
                rooms.push(room)
            }
            console.log('rooms array', rooms)
        }

        fn()
    }, [metamaskAddress, session, rooms])

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
