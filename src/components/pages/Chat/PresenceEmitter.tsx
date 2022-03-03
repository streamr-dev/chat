import { useStore } from '../../Store'
import { useEffect } from 'react'
import { useSend } from './MessageTransmitter'
import { MetadataType } from './MessageAggregator'
import { Partition, RoomId } from '../../../utils/types'

type Props = {
    roomId: RoomId
}

const PresenceEmitter = ({ roomId }: Props) => {
    const { account } = useStore()

    const send = useSend()

    useEffect(() => {
        const interval = setInterval(() => {
            send(MetadataType.UserOnline, {
                streamPartition: Partition.Metadata,
                streamId: roomId,
                data: account,
            })
        }, 60 * 1000)
        return () => clearInterval(interval)
    }, [roomId, account, send])

    return <></>
}

export default PresenceEmitter
