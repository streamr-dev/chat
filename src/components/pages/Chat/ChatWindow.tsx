import React, { forwardRef, useLayoutEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { KARELIA, MEDIUM } from '../../../utils/css'

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

const RoomName = styled.div`
    flex-grow: 1;
    font-family: ${KARELIA};
    font-size: 1.625rem;
    font-weight: ${MEDIUM};
    line-height: normal;
`

const RoomActions = styled.div`
    display: flex;
`

const RoomAction = styled.button`
    appearance: none;
    background-color: #F7F9FC;
    border-radius: 50%;
    border: 0;
    display: block;
    height: 2.5rem;
    width: 2.5rem;

    & + & {
        margin-left: 0.75rem;
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

const Footer = styled.div`
    padding: 1.5rem;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;

    input {
        background-color: #F7F9FC;
        border-radius: 0.75rem;
        border: 0;
        outline: 0;
        height: 3rem;
        padding: 0 1.25rem;
        width: 100%;
    }
`

type Props = {
    className?: string,
    children?: React.ReactNode,
    onSubmit?: (arg0: string) => void,
    title?: string,
}

const UnstyledChatWindow = ({ className, children, onSubmit, title }: Props) => {
    const [value, setValue] = useState<string>('')

    const feedRef = useRef<HTMLDivElement>(null)

    const onKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && /\w/.test(value) && typeof onSubmit === 'function') {
            onSubmit(value)
            setValue('')
        }
    }

    useLayoutEffect(() => {
        const { current: feed } = feedRef

        if (feed) {
            feed.scrollTop = feed.scrollHeight
        }
    }, [children])

    return (
        <div className={className}>
            <Header>
                <RoomName>
                    {title || <>&zwnj;</>}
                </RoomName>
                <RoomActions>
                    <RoomAction />
                    <RoomAction />
                </RoomActions>
            </Header>
            <FeedWrap>
                <div>
                    <Feed ref={feedRef}>
                        {children}
                    </Feed>
                </div>
            </FeedWrap>
            <Footer>
                <input
                    type="text"
                    placeholder="Type a message"
                    value={value}
                    onChange={(e) => {
                        setValue(e.currentTarget.value)
                    }}
                    onKeyDown={onKeyDown}
                />
            </Footer>
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
