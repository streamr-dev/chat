import { State } from '$/types'
import { call, select } from 'redux-saga/effects'
import StreamrClient from '@streamr/sdk'

export default function getTransactionalClient() {
    return call(function* () {
        const client: StreamrClient | undefined = yield select(
            ({ wallet }: State) => wallet.transactionalClient
        )

        if (!client) {
            throw new Error('Transactional client is missing')
        }

        return client
    })
}
