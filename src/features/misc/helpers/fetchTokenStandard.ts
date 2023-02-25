import { ToastType } from '$/components/Toast'
import { MiscAction } from '$/features/misc'
import toast, { Controller } from '$/features/toaster/helpers/toast'
import { TokenStandard } from '$/features/tokenGatedRooms/types'
import { selectTokenStandard } from '$/hooks/useTokenStandard'
import { call, put, select } from 'redux-saga/effects'
import fetchTokenStandardUtil from '$/utils/fetchTokenStandard'
import { Flag } from '$/features/flag/types'

export default function fetchTokenStandard({
    address,
    provider,
}: ReturnType<typeof MiscAction.fetchTokenStandard>['payload']) {
    return call(function* () {
        let tc: Controller | undefined

        try {
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
                        tokenIds: [],
                        fingerprint: Flag.isFetchingTokenMetadata(address, []),
                    })
                )
            }
        } catch (e) {
            // Noop.
        } finally {
            tc?.dismiss()
        }
    })
}
