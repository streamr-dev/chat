import React from 'react'
import styled, { css } from 'styled-components'
import { KARELIA } from '../../../utils/css'

export type Props = {
    active?: boolean
    afterContent?: React.ReactNode
    children?: React.ReactNode
    className?: string
    icon?: React.ReactNode
    onClick?: () => void
}

type IconWrapProps = {
    $visible?: boolean
}

const IconWrap = styled.div<IconWrapProps>`
    background: #ffffff;
    border-radius: 50%;
    flex: 0 0 3rem;
    height: 3rem;
    margin-right: 1rem;
    padding: 13px;
    transition: background-color 0.3s;
    width: 3rem;

    ${({ $visible }) =>
        !$visible &&
        css`
            visibility: hidden;
        `}
`

const Content = styled.div`
    flex: 1 1 auto;
    min-width: 0;
`

const UnstyledSidebarItem = ({
    icon,
    children,
    onClick,
    className,
    afterContent,
}: Props) => (
    <button type="button" onClick={onClick} className={className}>
        <IconWrap $visible={!!icon}>{icon}</IconWrap>
        <Content>{children}</Content>
        {afterContent}
    </button>
)

const SidebarItem = styled(UnstyledSidebarItem)`
    align-items: center;
    appearance: none;
    background-color: rgba(255, 255, 255, 0.3);
    border-radius: 1.25rem;
    border: none;
    cursor: pointer;
    display: flex;
    font-size: 1rem;
    font-family: ${KARELIA};
    height: 5.75rem;
    padding: 0 1.5rem;
    text-align: left;
    width: 100%;
    transition: 0.8s background-color;

    & + & {
        margin-top: 1rem;
    }

    ${({ active }) =>
        !!active &&
        css`
            background-color: #ffffff !important;
            transition-duration: 0.1s;
        `}

    :hover {
        background-color: rgba(255, 255, 255, 0.8);
        transition-duration: 0.1s;
    }

    :hover ${IconWrap} {
        box-shadow: 0 0 5px rgba(0, 0, 0, 0.05);
    }
`

export default SidebarItem
