import { Flag } from '$/features/flag/types'
import { MiscAction } from '$/features/misc'
import { RoomAction } from '$/features/room'
import { RoomId } from '$/features/room/types'
import { selectPrivacy } from '$/hooks/usePrivacy'
import { PrivacySetting } from '$/types'
import fetchPrivacy from '$/utils/fetchPrivacy'
import getRoomMetadata from '$/utils/getRoomMetadata'
import getWalletProvider from '$/utils/getWalletProvider'
import handleError from '$/utils/handleError'
import { call, fork, put, select } from 'redux-saga/effects'
import type StreamrClient from 'streamr-client'
import type { Stream } from 'streamr-client'

export default function fetchStream(roomId: RoomId, streamrClient: StreamrClient) {
    return call(function* () {
        try {
            const stream: Stream = yield streamrClient.getStream(roomId)

            const {
                tokenAddress,
                tokenIds = [],
                minRequiredBalance = '0',
            } = getRoomMetadata(stream)

            yield put(
                RoomAction.cacheTokenGate({
                    roomId,
                    tokenGate: tokenAddress
                        ? {
                              tokenAddress,
                              tokenIds,
                              minRequiredBalance,
                          }
                        : null,
                })
            )

            const provider = yield* getWalletProvider()

            if (tokenAddress) {
                yield put(
                    MiscAction.fetchTokenStandard({
                        address: tokenAddress,
                        provider,
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
