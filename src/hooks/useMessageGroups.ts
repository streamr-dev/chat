import { IMessage, IResend } from '$/features/message/types'
import getBeginningOfDay from '$/utils/getBeginningOfDay'
import { useMemo } from 'react'

interface Manifest {
    messages: IMessage[]
    newDay: boolean
}

interface Manifests {
    [timestamp: string]: Manifest
}

interface Group extends Manifest {
    timestamp: number
}

export default function useMessageGroups(messages: IMessage[], resends: IResend[]): Group[] {
    return useMemo(() => {
        const manifests: Manifests = {}

        resends.forEach((r) => {
            // Collect existing resends so that empty "days" can be displayed in the message feed.
            manifests[r.beginningOfDay] = {
                messages: [],
                newDay: true,
            }
        })

        let previousCreatedAt: undefined | number = undefined

        let rangeTimestamp: undefined | number = undefined

        messages.forEach((m) => {
            if (typeof m.createdAt !== 'number') {
                return []
            }

            let startsDay = true

            let startsRange = true

            const bod = getBeginningOfDay(m.createdAt)

            if (typeof previousCreatedAt === 'number') {
                startsDay = bod !== getBeginningOfDay(previousCreatedAt)

                // Group messages that happen within 15 minutes from each other.
                startsRange = !startsDay && previousCreatedAt + 900000 <= m.createdAt
            }

            previousCreatedAt = m.createdAt

            if (manifests[bod]?.messages?.length === 0) {
                // There are messages for the given day. Let's remove the manifest that represents
                // a resend (empty day).
                delete manifests[bod]
            }

            if (startsRange || startsDay) {
                rangeTimestamp = m.createdAt
            }

            if (typeof rangeTimestamp !== 'number') {
                throw new Error('This should not happen. Please report if it did.')
            }

            if (!manifests[rangeTimestamp]) {
                manifests[rangeTimestamp] = {
                    messages: [],
                    newDay: startsDay,
                }
            }

            manifests[rangeTimestamp].messages.push(m)
        })

        return Object.keys(manifests)
            .sort()
            .map((ts) => ({ timestamp: Number(ts), ...manifests[ts] }))
    }, [messages, resends])
}
