import React, { forwardRef, useLayoutEffect, useRef } from 'react'
import styled from 'styled-components'
import MessageInput from './MessageInput'
import RoomName from './RoomName'
import ModifyIcon from './modify.svg'
import MoreIcon from './more.svg'
import { ActionType, useDispatch, useStore } from './ChatStore'

const Header = styled.div`
    align-items: center;
    box-shadow: inset 0 -1px 0 #DEE6EE;
    display: flex;
    height: 92px;
    padding: 0 2rem;
    position: absolute;
    top: 0;
    width: 100%;
`

const RoomActions = styled.div`
    display: flex;
    margin-left: 1rem;
`

const RoomAction = styled.button`
    appearance: none;
    border-radius: 50%;
    border: 0;
    cursor: pointer;
    display: block;
    height: 2.5rem;
    width: 2.5rem;
    padding: 0;
    transition: 300ms background-color;

    &[disabled] {
        cursor: default;
        opacity: 0.5;
    }

    :hover {
        background-color: #EBEFF5;
        transition-duration: 50ms;
    }

    &,
    &[disabled] {
        background-color: #F7F9FC;
    }

    & + & {
        margin-left: 0.75rem;
    }

    img {
        display: block;
    }
`

const FeedWrap = styled.div`
    height: 100%;
    padding: 92px 0 96px;

    > div {
        height: 100%;
    }
`

const FeedFlex = styled.div`
    max-height: 100%;
    overflow: auto;
    padding: 1.5rem 1.5rem 0;
`

type FeedProps = {
    className?: string,
    children?: React.ReactNode,
}

const UnstyledFeed = forwardRef(({ className, children }: FeedProps, ref: React.Ref<HTMLDivElement>) => (
    <div className={className}>
        <div />
        <FeedFlex ref={ref}>
            {children}
        </FeedFlex>
    </div>
))

const Feed = styled(UnstyledFeed)`
    height: 100%;
    display: flex;
    flex-direction: column;

    > div:first-child {
        flex-grow: 1;
    }
`

type Props = {
    children?: React.ReactNode,
    className?: string,
    onSubmit?: (arg0: string) => void,
}

const UnstyledChatWindow = ({ className, children }: Props) => {
    const feedRef = useRef<HTMLDivElement>(null)

    useLayoutEffect(() => {
        const { current: feed } = feedRef

        if (feed) {
            feed.scrollTop = feed.scrollHeight
        }
    }, [children])

    const dispatch = useDispatch()

    const { roomNameEditable } = useStore()

    return (
        <div className={className}>
            <Header>
                <RoomName />
                <RoomActions>
                    <RoomAction
                        onClick={() => {
                            dispatch({
                                type: ActionType.EditRoomName,
                                payload: true,
                            })
                        }}
                        disabled={roomNameEditable}
                    >
                        <img src={ModifyIcon} alt="" />
                    </RoomAction>
                    <RoomAction>
                        <img src={MoreIcon} alt="" />
                    </RoomAction>
                </RoomActions>
            </Header>
            <FeedWrap>
                <div>
                    <Feed ref={feedRef}>
                        {children}
                    </Feed>
                </div>
            </FeedWrap>
            <MessageInput />
        </div>
    )
}

const ChatWindow = styled(UnstyledChatWindow)`
    background-color: #ffffff;
    border-radius: 1.25rem;
    position: absolute;
    height: 100%;
    top: 0;
    left: 24rem;
    right: 0;
`

export default ChatWindow
