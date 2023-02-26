import { Address } from '$/types'
import { retry } from 'redux-saga/effects'
import { Stream, StreamPermission } from 'streamr-client'

export default function waitForPermission({
    stream,
    account,
    permission,
}: {
    stream: Stream
    account: Address
    permission: StreamPermission
}) {
    return retry(30, 2000, function* () {
        const value: boolean = yield stream.hasPermission({
            user: account,
            permission,
            allowPublic: true,
        })

        if (!value) {
            throw new Error('No permission')
        }
    })
}
