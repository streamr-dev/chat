import TokenIdToast from '$/components/TokenIdToast'
import { Controller as ToastController } from '$/components/Toaster'
import toaster from '$/features/toaster/helpers/toaster'
import { TokenStandard } from '$/features/tokenGatedRooms/types'

export default function* tokenIdPreflight({ tokenStandard }: { tokenStandard: TokenStandard }) {
    let tc: ToastController<typeof TokenIdToast> | undefined

    try {
        tc = yield toaster(TokenIdToast, {
            tokenStandard,
        })

        const tokenId: string = yield tc?.open()

        return tokenId
    } finally {
        tc?.dismiss()
    }
}
