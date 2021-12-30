import { useEffect, useMemo, useState } from 'react'
import Helmet from 'react-helmet'
import styled from 'styled-components'
import ChatWindow from './ChatWindow'
import Sidebar from './Sidebar'
import Navbar from '../../Navbar'
import Room from './Room'
import Background from '../Home/background.png'
import type { MessagePayload } from './Message'
import Message from './Message'
import ChatStore from './ChatStore'

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

type RoomPayload = {
    id: number,
    name: string,
    readAt: number,
}

const room0: RoomPayload = {
    id: 0,
    name: 'Lorem ipsums dfkjashdfb kjashbf kjasbhfdk jabsdf',
    readAt: new Date(2022, 12, 20).getTime(), // future, altho no messages (wat? lol)
}

const room1: RoomPayload = {
    id: 1,
    name: 'sfkhsdfkjbdkgbsdkfhbgksdjhbfgksjdhgsdfjbs',
    readAt: new Date(2021, 12, 20).getTime(), // past
}

const room2: RoomPayload = {
    id: 2,
    name: 'Emat',
    readAt: new Date(2022, 12, 20).getTime(), // future
}

// TBD from streamr client.
const SOMEONE = '0x0x7da4E5E40C41f5eCbeFb4fa59B2153888a11731'

// TBD from streamr client
const SOMEONE_ELSE = '0x0xcd9c7c57a2d1468686c2d141530f7b70e771c05'

// TBD from web3 provider.
const ME = '0x7da4e5e40c41f5ecbefb4fa59b2153888a11731'

type MessagesCollection = {
    [index: string | number]: Array<MessagePayload>,
}

const EMPTY_ROOM: Array<MessagePayload> = []

const UnstyledChat = ({ className }: Props) => {
    const [roomId, setRoomId] = useState<number | undefined>()

    const [messages, setMessages] = useState<MessagesCollection>({
        [room0.id]: [
            { id: 0, from: SOMEONE, body: 'Hey there', createdAt: new Date(2020, 12, 20).getTime() },
            { id: 1, from: SOMEONE, body: 'U guys heard of that new virus thing?', createdAt: new Date(2020, 12, 20).getTime() },
            { id: 2, from: ME, body: 'Yep, nothing to worry about', createdAt: new Date(2020, 12, 20).getTime() },
            { id: 3, from: ME, body: 'lol', createdAt: new Date(2020, 12, 20).getTime() },
            { id: 4, from: SOMEONE, body: 'sic', createdAt: new Date(2021, 3, 26).getTime() },
            { id: 5, from: SOMEONE_ELSE, body: 'lol', createdAt: new Date(2021, 12, 20).getTime() },
            { id: 6, from: SOMEONE_ELSE, body: 'that did not age well', createdAt: new Date(2021, 12, 20).getTime() },
            { id: 7, from: ME, body: 'ikr?!', createdAt: new Date(2021, 12, 20).getTime() },
        ],
        [room1.id]: [],
        [room2.id]: [],
    })

    const rooms = useMemo<RoomPayload[]>(() => [
        room0,
        room1,
        room2,
    ], [])

    const roomMessages: Array<MessagePayload> = roomId != null ? messages[roomId] : EMPTY_ROOM

    const room = roomId != null ? rooms[roomId] : undefined

    useEffect(() => {
        if (roomId == null && rooms.length) {
            setRoomId(0)
        }
    }, [roomId, rooms])

    return (
        <ChatStore>
            <Helmet title="Let's chat!" />
            <main className={className}>
                <Navbar />
                <Content>
                    <div>
                        <Sidebar>
                            {rooms.map((room) => (
                                <Room
                                    key={room.id}
                                    active={room.id === roomId}
                                    name={room.name}
                                    onClick={() => {
                                        setRoomId(room.id)
                                    }}
                                    recentMessage={[...messages[room.id]].pop()}
                                    unread={false}
                                />
                            ))}
                        </Sidebar>
                        <ChatWindow
                            roomId={roomId}
                            title={room && room.name}
                            onSubmit={(body: string) => {
                                if (roomId == null) {
                                    return
                                }

                                setMessages((current) => ({
                                    ...current,
                                    [roomId]: [
                                        ...current[roomId],
                                        {
                                            id: current[roomId].length + 1,
                                            from: ME,
                                            body,
                                            createdAt: Date.now(),
                                        },
                                    ],
                                }))
                            }}
                        >
                            {roomMessages.map((message) => (
                                <Message
                                    incoming={message.from !== ME}
                                    key={message.id}
                                    payload={message}
                                />
                            ))}
                        </ChatWindow>
                    </div>
                </Content>
            </main>
        </ChatStore>
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
