import metaMaskAdapter from './metaMask'
import walletConnectAdapter from './walletConnect'
import coinbaseWalletAdapter from './coinbaseWallet'
import { AdapterId } from '../../../../types/common'

const adapters = [metaMaskAdapter, walletConnectAdapter, coinbaseWalletAdapter]

let map: any

export function lookup(adapterId: AdapterId) {
    if (!map) {
        map = {}

        adapters.forEach((adapter) => {
            map[adapter.id] = adapter
        })
    }

    return map[adapterId]
}

export default adapters
