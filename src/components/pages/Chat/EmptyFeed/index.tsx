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
    const [roomCreatedAt, setRoomCreatedAt] = useState<number | undefined>(
        undefined
    )

    const {
        roomId,
        session: { streamrClient },
    } = useStore()

    useEffect(() => {
        let mounted = true

        const fn = async () => {
            if (!streamrClient || !roomId || !mounted) {
                return
            }
            const stream = await streamrClient.getStream(roomId)
            if (!mounted) {
                return
            }
            const description = getRoomMetadata(stream.description!)
            setRoomCreatedAt(description.createdAt)
        }

        fn()

        return () => {
            mounted = false
        }
    }, [roomId, streamrClient])

    return (
        <div className={className}>
            <>
                {roomCreatedAt ? (
                    <CreatedAt>
                        You created this room on{' '}
                        {format(roomCreatedAt, 'iiii, LLL do yyyy')}
                    </CreatedAt>
                ) : null}
                <AddMemberModal />
            </>
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
