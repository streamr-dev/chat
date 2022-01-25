import styled from 'styled-components'
import { format } from 'date-fns'
import { KARELIA, MEDIUM } from '../../../../utils/css'
import Button from '../../../Button'
import AddMemberIcon from './member.svg'
import { useEffect, useState } from 'react'
import { useSend } from '../MessageTransmitter'

type Props = {
    className?: string
    roomCreatedAt?: number
}

const AddMemberButton = styled(Button)`
    align-items: center;
    background: rgba(255, 89, 36, 0.08);
    border-radius: 1.5rem;
    color: #ff5924;
    cursor: pointer;
    display: flex;
    margin: 0 auto;
    padding: 0 2rem;

    span {
        display: block;
        font-family: ${KARELIA};
        font-size: 1.125rem;
        font-weight: ${MEDIUM};
        transform: translateY(-0.1em);
    }

    img {
        display: block;
        margin-right: 0.75rem;
    }
`

const CreatedAt = styled.span`
    display: block;
    letter-spacing: 0.02em;
    margin-bottom: 2rem;
`

const UnstyledEmptyFeed = ({ className, roomCreatedAt }: Props) => {
    const [invitee, setInvitee] = useState('0x0')

    useEffect(() => {}, [invitee])

    const send = useSend()

    return (
        <div className={className}>
            <div>
                {roomCreatedAt != null && (
                    <CreatedAt>
                        You created this room on{' '}
                        {format(roomCreatedAt, 'iiii, LLL do yyyy')}
                    </CreatedAt>
                )}
                <input
                    type="text"
                    value={invitee}
                    placeholder="Ethereum address"
                    onChange={(event) => setInvitee(event.target.value)}
                ></input>
                <AddMemberButton
                    type="button"
                    onClick={() => {
                        send(`/invite ${invitee}`, {
                            streamPartition: 0,
                        })
                    }}
                >
                    <img src={AddMemberIcon} alt="" />
                    <span>Add member</span>
                </AddMemberButton>
            </div>
        </div>
    )
}

const EmptyFeed = styled(UnstyledEmptyFeed)`
    align-items: center;
    color: #59799c;
    display: flex;
    flex-direction: column;
    height: 100%;
    justify-content: center;
    overflow: hidden;
    padding-top: 1rem;
`

export default EmptyFeed
