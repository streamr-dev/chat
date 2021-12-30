import styled, { css } from 'styled-components'
import Identicon from 'identicon.js'
import DateTooltip from './DateTooltip'
import type { MessagePayload } from './types'
import { useStore } from './ChatStore'

type Props = {
    className?: string,
    payload: MessagePayload,
    incoming?: boolean,
}

const Body = styled.div`
    background-color: #F1F4F7;
    border-radius: 0.75rem;
    flex: 0 1 auto;
    font-size: 0.875rem;
    line-height: 1.25rem;
    max-width: 100%;
    min-width: 0;
    padding: 0.625rem 1rem;
    position: relative;
    word-wrap: break-word;
`

const AvatarWrap = styled.div`
    flex-shrink: 0;
    margin-right: 1rem;
`

const Avatar = styled.img`
    background-color: #F1F4F7;
    border-radius: 50%;
    height: 2.5rem;
    width: 2.5rem;
`

type RootProps = {
    $incoming?: boolean,
}

const Root = styled.div<RootProps>`
    ${({ $incoming }) => !$incoming && css`
        justify-content: flex-end;

        ${Body} {
            background-color: #615EF0;
            color: #ffffff;
        }
    `}
`

const AVATAR_OPTIONS = {
    size: 40,
}

const UnstyledMessage = ({ className, payload: { sender, body, createdAt } }: Props) => {
    const { identity } = useStore()

    const incoming = identity !== sender

    return (
        <Root className={className} $incoming={incoming}>
            {incoming && (
                <AvatarWrap>
                    <Avatar
                        src={`data:image/png;base64,${new Identicon(sender, AVATAR_OPTIONS).toString()}`}
                        alt={sender}
                    />
                </AvatarWrap>
            )}
            <Body>
                <DateTooltip timestamp={createdAt} />
                {body}
            </Body>
            {!incoming && (
                <AvatarWrap>
                    <Avatar
                        src={`data:image/png;base64,${new Identicon(sender, AVATAR_OPTIONS).toString()}`}
                        alt={sender}
                    />
                </AvatarWrap>
            )}
        </Root>
    )
}

const Message = styled(UnstyledMessage)`
    display: flex;

    ${Body} + ${AvatarWrap} {
        margin: 0 0 0 1rem;
    }

    & + & {
        margin-top: 0.625rem;
    }

    ${Body}:hover ${DateTooltip} {
        opacity: 1;
        transition-delay: 1s;
        visibility: visible;
    }
`

export default Message
