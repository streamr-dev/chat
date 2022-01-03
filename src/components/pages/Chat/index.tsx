import Helmet from 'react-helmet'
import styled from 'styled-components'
import ChatWindow from './ChatWindow'
import Sidebar from './Sidebar'
import Navbar from '../../Navbar'
import Room from './Room'
import Background from '../Home/background.png'
import Message from './Message'
import { useMessages, useStore } from './ChatStore'
import usePopulate from './usePopulate'

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
    usePopulate('0x7da4e5e40c41f5ecbefb4fa59b2153888a11731')

    const messages = useMessages()

    const { roomId, rooms } = useStore()

    return (
        <>
            <Helmet title="Let's chat!" />
            <main className={className}>
                <Navbar />
                <Content>
                    <div>
                        <Sidebar>
                            {rooms.map((room) => (
                                <Room
                                    key={room.id}
                                    id={room.id}
                                    active={room.id === roomId}
                                    name={room.name}
                                    unread={false}
                                />
                            ))}
                        </Sidebar>
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
