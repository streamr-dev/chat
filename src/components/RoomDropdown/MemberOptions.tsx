import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import MoreIcon from './more.svg'
import ModifyIcon from './modify.svg'
import { KARELIA } from '../../utils/css'
import { CopyIcon, DeleteIcon } from '../../icons'
import ExternalLinkIcon from '../../icons/ExternalLinkIcon'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { useLocalStorage } from '../../hooks/useLocalStorage'

const Root = styled.div`
    padding: 15px 0px;
    min-height: 85px;
    background-color: #f1f4f7;
    margin: 5px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    flex-direction: row;
`

const Subtitle = styled.span`
    font-size: 12px;
    color: #59799c;

    cursor: pointer;
`

const MemberIcon = styled.div`
    height: 3rem;
    width: 3rem;
    background-color: #cdcfd1;
    border-radius: 50%;
    margin: 0px 20px;
`

const EditButton = styled.div`
    position: relative;
    height: 2.5rem;
    width: 2.5rem;
    background-color: white;
    border-radius: 50%;
    margin: 0px 20px;
    margin-left: auto;
`

const MemberName = styled.span`
    width: 224px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    line-height: 30px;
`

const MemberInput = styled.input`
    border: 1px solid #dee6ee;
    border-radius: 8px;
    font-size: 16px;
    width: 100%;
    line-height: 18px;
    padding: 7px 12px;
`

const DropDownContainer = styled.div`
    margin-left: 10px;
`

const MemberContainer = styled.div`
    display: flex;
    flex-direction: column;
`

const DropDownListContainer = styled.div`
    position: absolute;
    top: 45px;
    right: 0px;
    z-index: 100;
`

const DropDownList = styled.div`
    width: fit-content;
    padding: 0;
    margin: 0;
    background: #ffffff;
    border-radius: 10px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    box-sizing: border-box;
    color: #59799c;
    font-family: ${KARELIA};
    font-size: 14px;
    list-style-type: none;
    border-spacing: 0px;

    hr {
        border: 0;
        border-top: 1px solid #dee6ee;
        padding: 0px;
        margin: 0px;
    }
`

const ListItem = styled.div`
    white-space: nowrap;
    padding: 10px 15px;
    background-clip: padding-box;
    display: flex;
    align-items: center;

    &:first-child {
        padding-top: 15px;
        border-radius: 10px 10px 0 0;
    }

    &:last-child {
        padding-bottom: 15px;
        border-radius: 0 0 10px 10px;
    }

    :hover {
        background-color: #f1f4f7;
    }

    svg {
        width: 1rem;
        margin-right: 0.75rem;
    }
`

const UnstyledMemberOptions = ({ address }: any) => {
    const [isDropdownOpen, setDropdownOpen] = useState<boolean>(false)
    const [editing, setEditing] = useState<boolean>(false)

    const ref = useRef<HTMLDivElement>(null)
    const buttonRef = useRef<HTMLDivElement>(null)

    const [nickname, setNickname] = useLocalStorage(
        `nickname:${address}`,
        address
    )

    useEffect(() => {
        function handleClickOutside(event: any) {
            //setDropdownOpen(false)
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [ref, buttonRef])
    return (
        <Root>
            <MemberIcon />
            <MemberContainer>
                {editing ? (
                    <MemberInput
                        placeholder={address}
                        value={nickname}
                        onChange={(e) => {
                            setNickname(e.target.value)
                        }}
                    />
                ) : (
                    <MemberName>{nickname ? nickname : address}</MemberName>
                )}
                {editing ? (
                    <Subtitle>Nickname is only visible to you</Subtitle>
                ) : (
                    <Subtitle
                        onClick={() => {
                            setEditing(true)
                        }}
                    >
                        {nickname ? 'Edit nickname' : 'Set nickname'}
                    </Subtitle>
                )}
            </MemberContainer>
            {editing ? (
                <EditButton
                    onClick={() => {
                        setEditing(false)
                    }}
                >
                    <img src={ModifyIcon} alt="" />
                </EditButton>
            ) : (
                <>
                    <EditButton
                        onClick={() => {
                            setDropdownOpen(!isDropdownOpen)
                        }}
                    >
                        <img src={MoreIcon} alt="" />
                        <DropDownContainer ref={ref}>
                            {isDropdownOpen && (
                                <DropDownListContainer>
                                    <DropDownList>
                                        <ListItem>
                                            <a
                                                rel="noreferrer"
                                                href={`https://polygonscan.com/address/${address}`}
                                                target="_blank"
                                            >
                                                <ExternalLinkIcon />
                                                View on explorer
                                            </a>
                                        </ListItem>

                                        <ListItem>
                                            <CopyToClipboard text={address}>
                                                <span>
                                                    <CopyIcon />
                                                    Copy address
                                                </span>
                                            </CopyToClipboard>
                                        </ListItem>
                                        <ListItem
                                            onClick={() =>
                                                alert(
                                                    'requires NET-843 merged to be implemented'
                                                )
                                            }
                                        >
                                            <DeleteIcon />
                                            Delete member
                                        </ListItem>
                                    </DropDownList>
                                </DropDownListContainer>
                            )}
                        </DropDownContainer>
                    </EditButton>
                </>
            )}
        </Root>
    )
}

const MemberOptions = styled(UnstyledMemberOptions)``

export default MemberOptions
