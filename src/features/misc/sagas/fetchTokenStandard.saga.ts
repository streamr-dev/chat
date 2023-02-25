import { MiscAction } from '$/features/misc'
import { put, select, takeLatest } from 'redux-saga/effects'
import { TokenStandard } from '$/features/tokenGatedRooms/types'
import { Flag } from '$/features/flag/types'
import { FlagAction } from '$/features/flag'
import { selectTokenStandard } from '$/hooks/useTokenStandard'
import toast, { Controller } from '$/features/toaster/helpers/toast'
import { ToastType } from '$/components/Toast'
import fetchTokenStandardUtil from '$/utils/fetchTokenStandard'

export default function* fetchTokenStandard() {
    yield takeLatest(MiscAction.fetchTokenStandard, function* ({ payload: { address, provider } }) {
        let tc: Controller | undefined

        try {
            yield put(FlagAction.set(Flag.isFetchingTokenStandard(address)))

            const currentStandard: undefined | TokenStandard = yield select(
                selectTokenStandard(address)
            )

            if (!currentStandard) {
                tc = yield toast({
                    title: 'Loading token info…',
                    type: ToastType.Processing,
                })

                const standard: TokenStandard = yield fetchTokenStandardUtil(address, provider)

                yield put(
                    MiscAction.setTokenStandard({
                        address,
                        standard,
                    })
                )

                yield put(
                    MiscAction.fetchTokenMetadata({
                        tokenAddress: address,
                        tokenStandard: standard,
                        provider,
                        tokenIds: ['0'],
                        fingerprint: Flag.isGettingTokenMetadata(address),
                    })
                )
            }
        } catch (e) {
            // Noop.
        } finally {
            tc?.dismiss()

            yield put(FlagAction.unset(Flag.isFetchingTokenStandard(address)))
        }
    })
}
