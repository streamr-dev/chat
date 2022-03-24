import styled from 'styled-components'
import { format } from 'date-fns'
import AddMemberModal from '../AddMemberModal'
import { useEffect, useState } from 'react'
import { useStore } from '../../../Store'
import getRoomMetadata from '../../../../getters/getRoomMetadata'

type Props = {
    className?: string
}

const CreatedAt = styled.span`
    display: block;
    letter-spacing: 0.02em;
    margin-bottom: 2rem;
`

const UnstyledEmptyFeed = ({ className }: Props) => {
    const [roomCreatedAt, setRoomCreatedAt] = useState(0)

    const {
        roomId,
        session: { streamrClient },
    } = useStore()

    useEffect(() => {
        let mounted = true

        const fn = async () => {
            if (!streamrClient || !roomId || roomCreatedAt !== 0) {
                return
            }
            const stream = await streamrClient.getStream(roomId)
            if (!mounted) {
                return
            }
            const description = getRoomMetadata(stream.description)
            setRoomCreatedAt(description.createdAt)
        }

        fn()

        return () => {
            mounted = false
        }
    }, [roomId, streamrClient, roomCreatedAt, setRoomCreatedAt])

    return (
        <div className={className}>
            <div>
                <CreatedAt>
                    You created this room on{' '}
                    {format(roomCreatedAt, 'iiii, LLL do yyyy')}
                </CreatedAt>
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
