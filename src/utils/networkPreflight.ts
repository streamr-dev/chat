import addNetwork from '$/utils/addNetwork'
import switchNetwork from '$/utils/switchNetwork'
import isCorrectNetwork from './isCorrectNetwork'
import getWalletProvider from '$/utils/getWalletProvider'

export default function* networkPreflight() {
    const provider = yield* getWalletProvider()

    try {
        if ((yield isCorrectNetwork(provider)) as boolean) {
            return
        }

        yield switchNetwork(provider)
    } catch (e: any) {
        if (e.code !== 4902) {
            throw e
        }

        yield addNetwork(provider)
    }
}
