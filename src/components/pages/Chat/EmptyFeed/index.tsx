import styled from 'styled-components'
import { format } from 'date-fns'
import AddMemberModal from '../AddMemberModal'
import { useEffect, useState } from 'react'
import { useStore } from '../../../Store'
import getRoomMetadata from '../../../../getters/getRoomMetadata'
import Button from '../../../Button'
import { KARELIA, MEDIUM } from '../../../../utils/css'
import AddMemberIcon from './member.svg'

type Props = {
    className?: string
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

const UnstyledEmptyFeed = ({ className }: Props) => {
    const [roomCreatedAt, setRoomCreatedAt] = useState<number | undefined>(
        undefined
    )

    const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false)

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
                    <>
                        <CreatedAt>
                            You created this room on{' '}
                            {format(roomCreatedAt, 'iiii, LLL do yyyy')}
                        </CreatedAt>

                        <AddMemberButton
                            type="button"
                            onClick={() => setIsAddMemberModalOpen(true)}
                        >
                            <img src={AddMemberIcon} alt="" />
                            <span>Add member</span>
                        </AddMemberButton>
                    </>
                ) : null}
                <AddMemberModal isOpen={isAddMemberModalOpen} />
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
