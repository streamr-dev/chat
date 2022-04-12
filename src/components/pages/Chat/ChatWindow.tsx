import React, { forwardRef, useLayoutEffect, useRef } from 'react'
import styled from 'styled-components'
import MessageInput from './MessageInput'
import RoomHeader from './RoomHeader'
import EmptyFeed from './EmptyFeed/index'

const FeedWrap = styled.div`
    height: 100%;
    padding: 92px 0 96px;

    > div {
        height: 100%;
    }

    @media only screen and (max-width: 768px) {
        padding: 0px 0 0px;
        overflow: hidden;
        height: 65%;

        > div {
            height: 100%;
            padding: 0 20px;
        }
    }
`

const FeedFlex = styled.div`
    max-height: 100%;
    overflow: auto;
    padding: 1.5rem 1.5rem 0;
`

type FeedProps = {
    className?: string
    children?: React.ReactNode
}

const UnstyledFeed = forwardRef(
    ({ className, children }: FeedProps, ref: React.Ref<HTMLDivElement>) => (
        <div className={className}>
            <div />
            <FeedFlex ref={ref}>{children}</FeedFlex>
        </div>
    )
)

const Feed = styled(UnstyledFeed)`
    height: 100%;
    display: flex;
    flex-direction: column;
    padding-bottom: 34px;

    > div:first-child {
        flex-grow: 1;
    }
`

type Props = {
    children?: React.ReactNode
    className?: string
    onSubmit?: (arg0: string) => void
}

const UnstyledChatWindow = ({ className, children }: Props) => {
    const feedRef = useRef<HTMLDivElement>(null)

    useLayoutEffect(() => {
        const { current: feed } = feedRef

        if (feed) {
            feed.scrollTop = feed.scrollHeight
        }
    }, [children])

    return (
        <div className={className}>
            <RoomHeader />
            <FeedWrap>
                <div>
                    {React.Children.count(children) ? (
                        <Feed ref={feedRef}>{children}</Feed>
                    ) : (
                        <EmptyFeed />
                    )}
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

    @media only screen and (max-width: 768px) {
        height: 60vh !important;
        position: static;
        left: 0;
        right: 0;
        margin-top: 20px;
    }
`

export default ChatWindow
