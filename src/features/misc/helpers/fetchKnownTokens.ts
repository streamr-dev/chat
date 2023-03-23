import { FlagAction } from '$/features/flag'
import { Flag } from '$/features/flag/types'
import { MiscAction } from '$/features/misc'
import { TokenInfo } from '$/features/misc/types'
import { put, take } from 'redux-saga/effects'

export default function* fetchKnownTokens() {
    while (true) {
        try {
            yield take(MiscAction.fetchKnownTokens)

            yield put(FlagAction.set(Flag.isFetchingKnownTokens()))

            try {
                const tokenlist: Response = yield fetch('tokenlist.json')

                const tokens: TokenInfo[] = yield tokenlist.json()

                yield put(MiscAction.setKnownTokens(tokens))

                // Break the loop. All we need is one successful fetch per session.
                break
            } catch (e) {
                // Repeat!
            }
        } finally {
            yield put(FlagAction.unset(Flag.isFetchingKnownTokens()))
        }
    }
}
