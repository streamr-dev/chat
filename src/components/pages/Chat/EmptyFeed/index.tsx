import styled from 'styled-components'
import { format } from 'date-fns'
import AddMemberModal from '../AddMemberModal'

type Props = {
    className?: string
    roomCreatedAt?: number
}

const CreatedAt = styled.span`
    display: block;
    letter-spacing: 0.02em;
    margin-bottom: 2rem;
`

const UnstyledEmptyFeed = ({ className, roomCreatedAt }: Props) => {
    return (
        <div className={className}>
            <div>
                {roomCreatedAt != null && (
                    <CreatedAt>
                        You created this room on{' '}
                        {format(roomCreatedAt, 'iiii, LLL do yyyy')}
                    </CreatedAt>
                )}
                <AddMemberModal />
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
