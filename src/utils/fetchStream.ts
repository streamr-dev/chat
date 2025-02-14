import { Flag } from '$/features/flag/types'
import { MiscAction } from '$/features/misc'
import { RoomAction } from '$/features/room'
import { RoomId } from '$/features/room/types'
import { selectPrivacy } from '$/hooks/usePrivacy'
import { PrivacySetting } from '$/types'
import fetchPrivacy from '$/utils/fetchPrivacy'
import getRoomMetadata, { RoomMetadata } from '$/utils/getRoomMetadata'
import getTransactionalClient from '$/utils/getTransactionalClient'
import handleError from '$/utils/handleError'
import { call, fork, put, select } from 'redux-saga/effects'
import type StreamrClient from '@streamr/sdk'
import type { Stream } from '@streamr/sdk'

export default function fetchStream(roomId: RoomId) {
    return call(function* () {
        try {
            const streamrClient: StreamrClient = yield getTransactionalClient()

            const stream: Stream = yield streamrClient.getStream(roomId)

            const {
                tokenAddress,
                tokenIds = [],
                minRequiredBalance = '0',
                stakingEnabled = false,
            }: RoomMetadata = yield getRoomMetadata(stream)

            yield put(
                RoomAction.cacheTokenGate({
                    roomId,
                    tokenGate: tokenAddress
                        ? {
                              tokenAddress,
                              tokenIds,
                              minRequiredBalance,
                              stakingEnabled,
                          }
                        : null,
                })
            )

            if (tokenAddress) {
                yield put(
                    MiscAction.fetchTokenStandard({
                        address: tokenAddress,
                        showLoadingToast: false,
                        fingerprint: Flag.isFetchingTokenStandard(tokenAddress),
                    })
                )
            }

            yield fork(function* () {
                try {
                    const currentPrivacy: PrivacySetting | undefined = yield select(
                        selectPrivacy(roomId)
                    )

                    if (currentPrivacy) {
                        return
                    }

                    const privacy: PrivacySetting = yield fetchPrivacy(stream)

                    yield put(
                        RoomAction.setLocalPrivacy({
                            roomId,
                            privacy,
                        })
                    )
                } catch (e) {
                    handleError(e)
                }
            })

            return stream
        } catch (e: any) {
            if (!/NOT_FOUND/.test(e?.message || '')) {
                throw e
            }
        }

        return null
    })
}
