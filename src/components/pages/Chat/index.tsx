import Helmet from 'react-helmet'
import styled from 'styled-components'
import ChatWindow from './ChatWindow'
import RoomList from './RoomList'
import Navbar from '../../Navbar'
import RoomItem from './RoomItem'
import Background from '../Home/background.png'
import Message from './Message'
import { useStore } from '../../Store'
import useExistingRooms from '../../../hooks/useExistingRooms'
import useRoomIdsStorage from '../../../hooks/useRoomIdsStorage'
import useEJPRequestDelegatedJoin from '../../../hooks/erc20JoinPolicy/useEJPRequestDelegatedJoin'

import { useNavigate } from 'react-router-dom'
import { Fragment, useEffect, useState } from 'react'
import MessageTransmitter from './MessageTransmitter'
import RoomNameLoader from './RoomNameLoader'
import PresenceEmitter from './PresenceEmitter'

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
    const {
        roomIds = [],
        session: { wallet },
        messages,
    } = useStore()

    useRoomIdsStorage()

    useExistingRooms()

    const sessionAccount = wallet?.address

    const navigate = useNavigate()

    useEffect(() => {
        if (!sessionAccount) {
            navigate('/')
        }
    }, [sessionAccount, navigate])

    const erc20RequestDelegatedJoin = useEJPRequestDelegatedJoin()
    const [isMount, setIsMount] = useState(false)
    useEffect(() => {
        if (isMount) {
            return
        }
        setIsMount(true)
        erc20RequestDelegatedJoin({})
    })

    return (
        <MessageTransmitter>
            {roomIds.map((id) => (
                <Fragment key={id}>
                    <RoomNameLoader roomId={id} />
                    <PresenceEmitter roomId={id} />
                </Fragment>
            ))}
            <Helmet title="Let's chat!" />
            <main className={className}>
                <Navbar />
                <Content>
                    <div>
                        <RoomList>
                            {roomIds.map((id) => (
                                <RoomItem key={id} id={id} />
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
        </MessageTransmitter>
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
