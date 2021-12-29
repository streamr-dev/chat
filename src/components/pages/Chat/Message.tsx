import styled, { css } from 'styled-components'

type Props = {
    className?: string,
    body?: string,
    createdAt?: number,
    from: string,
}

const Body = styled.div`
    background-color: #F1F4F7;
    border-radius: 0.75rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    max-width: 100%;
    padding: 0.625rem 1rem;
`

const AvatarWrap = styled.div`
    flex-shrink: 0;
    margin-right: 1rem;
`

const Avatar = styled.div`
    background-color: #F1F4F7;
    border-radius: 50%;
    height: 2.5rem;
    width: 2.5rem;
`

const ME = '0xa047314ff08Cead7726Ceb90fc0CB39D80607227'

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

const UnstyledMessage = ({ className, body = 'Message', createdAt = Date.now(), from }: Props) => {
    const incoming = from !== ME

    return (
        <Root className={className} $incoming={incoming}>
            {incoming && (
                <AvatarWrap>
                    <Avatar />
                </AvatarWrap>
            )}
            <Body>
                {from}
                <br />
                {body} at {createdAt}
            </Body>
            {!incoming && (
                <AvatarWrap>
                    <Avatar />
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
`

export default Message
