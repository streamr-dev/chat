import TokenIdToast from '$/components/TokenIdToast'
import { Layer, toaster } from '$/utils/toaster'
import { TokenStandard } from '$/features/tokenGatedRooms/types'
import { call } from 'redux-saga/effects'

export default function* tokenIdPreflight(tokenStandard: TokenStandard) {
    const result: string = yield call(function* () {
        const toast = toaster(TokenIdToast, Layer.Toast)

        try {
            return (yield toast.pop({
                tokenStandard,
            })) as string
        } finally {
            toast.discard()
        }
    })

    return result
}
