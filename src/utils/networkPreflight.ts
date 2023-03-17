import addNetwork from '$/utils/addNetwork'
import switchNetwork from '$/utils/switchNetwork'
import isCorrectNetwork from './isCorrectNetwork'
import getWalletProvider from '$/utils/getWalletProvider'
import { call, put } from 'redux-saga/effects'
import { WalletAction } from '$/features/wallet'
import getNewStreamrClient from '$/utils/getNewStreamrClient'

export default function networkPreflight() {
    return call(function* () {
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

        yield put(
            WalletAction.setTransactionalClient({
                streamrClient: getNewStreamrClient({
                    ethereum: provider,
                }),
            })
        )
    })
}
