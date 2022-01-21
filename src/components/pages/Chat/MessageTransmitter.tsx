import { createContext, useCallback, useContext } from 'react'
import { MessageType } from '../../../utils/types'
import { useStore } from '../../Store'
import { v4 as uuidv4 } from 'uuid'
import MessageAggregator from './MessageAggregator'

type TransmitFn = (
    payload: string,
    options: { streamPartition?: number }
) => void

const TransmitContext = createContext<TransmitFn>(() => {})

type Props = {
    children?: React.ReactNode
}

export function useSend(): TransmitFn {
    return useContext(TransmitContext)
}

export default function MessageTransmitter({ children }: Props) {
    const {
        account,
        roomId,
        session: { streamrClient },
    } = useStore()

    const send = useCallback<TransmitFn>(
        async (payload, { streamPartition = 0 }) => {
            if (!account || !roomId || !streamrClient) {
                return
            }

            await streamrClient.publish(
                roomId,
                {
                    body: payload,
                    createdAt: Date.now(),
                    id: uuidv4(),
                    sender: account,
                    type: MessageType.TEXT,
                    version: 1,
                },
                Date.now(),
                streamPartition
            )
        },
        [account, roomId, streamrClient]
    )

    return (
        <TransmitContext.Provider value={send}>
            <MessageAggregator>
                {children}
            </MessageAggregator>
        </TransmitContext.Provider>
    )
}
