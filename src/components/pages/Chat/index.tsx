import { useState } from 'react'
import Helmet from 'react-helmet'
import styled from 'styled-components'
import ChatWindow from './ChatWindow'
import Sidebar from './Sidebar'
import Navbar from '../../Navbar'
import Room from './Room'
import Background from '../Home/background.png'
import Message from './Message'

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

type MessagePayload = [
    id: number,
    from: string,
    body: string,
]

const UnstyledChat = ({ className }: Props) => {
    const [messages, setMessages] = useState<Array<MessagePayload>>([
        [0, '0xa047314ff08Cead7726Ceb90fc0CB39D80607227', 'Message 1'],
        [1, '0xa047314ff08Cead7726Ceb90fcACB39D80607227', 'Message 2'],
        [2, '0xa047314ff08Cead7726Ceb90fc0CB39D80607227', 'Message 3'],
        [3, '0xa047314ff08Cead7726Ceb90fcACB39D80607227', 'Message 4'],
        [4, '0xa047314ff08Cead7726Ceb90fcACB39D80607227', 'Message 5'],
        [5, '0xa047314ff08Cead7726Ceb90fc0CB39D80607227', 'Message 6'],
        [6, '0xa047314ff08Cead7726Ceb90fcACB39D80607227', 'Message 7'],
        [7, '0xa047314ff08Cead7726Ceb90fc0CB39D80607227', 'Message 8'],
        [8, '0xa047314ff08Cead7726Ceb90fcACB39D80607227', 'Message 9'],
        [9, '0xa047314ff08Cead7726Ceb90fc0CB39D80607227', 'Message 10'],
        [10, '0xa047314ff08Cead7726Ceb90fcACB39D80607227', 'Message 11'],
        [11, '0xa047314ff08Cead7726Ceb90fc0CB39D80607227', 'Message 12'],
        [12, '0xa047314ff08Cead7726Ceb90fc0CB39D80607227', 'Message 13'],
    ])

    const [roomId, setRoomId] = useState<number | void>()

    return (
        <>
            <Helmet title="Let's chat!" />
            <main className={className}>
                <Navbar />
                <Content>
                    <div>
                        <Sidebar>
                            <Room active={roomId === 0} name="Lorem ipsum" onClick={() => setRoomId(0)} />
                            <Room active={roomId === 1} name="Dolor sit" onClick={() => setRoomId(1)} />
                            <Room active={roomId === 2} name="Emat" onClick={() => setRoomId(2)} />
                            <Room active={roomId === 3} name="Lorem ipsum" onClick={() => setRoomId(3)} />
                        </Sidebar>
                        <ChatWindow
                            onSubmit={(body: string) => {
                                setMessages((current) => [
                                    ...current,
                                    [
                                        current.length + 1,
                                        '0xa047314ff08Cead7726Ceb90fc0CB39D80607227',
                                        body,
                                    ],
                                ])
                            }}
                        >
                            {messages.map(([id, from, body]) => (
                                <Message
                                    key={id}
                                    from={from}
                                    body={body}
                                    createdAt={Date.now()}
                                />
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
