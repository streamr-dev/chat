import { Flag } from '$/features/flag/types'
import { MiscAction } from '$/features/misc'
import { RoomAction } from '$/features/room'
import { RoomId } from '$/features/room/types'
import { selectWalletProvider } from '$/features/wallet/selectors'
import getRoomMetadata from '$/utils/getRoomMetadata'
import { Provider } from '@web3-react/types'
import { call, put, select } from 'redux-saga/effects'
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

            const provider: Provider | undefined = yield select(selectWalletProvider)

            if (!provider) {
                throw new Error('No provider')
            }

            if (tokenAddress) {
                yield put(
                    MiscAction.fetchTokenStandard({
                        address: tokenAddress,
                        provider,
                        fingerprint: Flag.isFetchingTokenStandard(tokenAddress),
                    })
                )
            }

            return stream
        } catch (e: any) {
            if (!/NOT_FOUND/.test(e?.message || '')) {
                throw e
            }
        }

        return null
    })
}
