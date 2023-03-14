import TokenIdToast from '$/components/TokenIdToast'
import { Controller as ToastController } from '$/components/Toaster'
import toaster from '$/features/toaster/helpers/toaster'
import { TokenStandard } from '$/features/tokenGatedRooms/types'
import { call } from 'redux-saga/effects'

export default function* tokenIdPreflight(tokenStandard: TokenStandard) {
    const result: string = yield call(function* () {
        let tc: ToastController<typeof TokenIdToast> | undefined

        try {
            tc = yield toaster(TokenIdToast, {
                tokenStandard,
            })

            return (yield tc?.open()) as string
        } finally {
            tc?.dismiss()
        }
    })

    return result
}
