import { useState } from 'react'
import styled from 'styled-components'
import MoreIcon from './more.svg'
import ModifyIcon from './modify.svg'

const Root = styled.div`
    padding: 15px 0px;
    min-height: 85px;
    width: 100%;
    background-color: #f1f4f7;
    margin: 5px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    flex-direction: row;

    .subtitle {
        font-size: 12px;
        color: #59799c;
    }
`

const MemberIcon = styled.div`
    height: 3rem;
    width: 3rem;
    background-color: #cdcfd1;
    border-radius: 50%;
    margin: 0px 20px;
`

const EditButton = styled.div`
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

const UnstyledMemberOptions = ({ address }: any) => {
    const [editing, setEditing] = useState(false)
    const [nickname, setNickname] = useState('')
    return (
        <Root>
            <MemberIcon />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
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
                <span className="subtitle">
                    {editing
                        ? 'Nickname is only visible to you'
                        : nickname
                        ? 'Edit nickname'
                        : 'Set nickname'}
                </span>
            </div>
            {editing ? (
                <EditButton
                    onClick={() => {
                        setEditing(false)
                    }}
                >
                    <img src={ModifyIcon} alt="" />
                </EditButton>
            ) : (
                <EditButton
                    onClick={() => {
                        setEditing(true)
                    }}
                >
                    <img src={MoreIcon} alt="" />
                </EditButton>
            )}
        </Root>
    )
}

const MemberOptions = styled(UnstyledMemberOptions)``

export default MemberOptions
