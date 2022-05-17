import { CoinbaseWallet } from '@web3-react/coinbase-wallet'
import { initializeConnector } from '@web3-react/core'
import { AdapterId, WalletAdapter } from '../../../../types/common'
import getChainUrls from '../../getChainUrls'
import Icon from '../icons/CoinbaseWalletIcon'

let connector: any

const walletAdapter: WalletAdapter = {
    id: AdapterId.CoinbaseWallet,
    label: 'Coinbase Wallet',
    icon: Icon,
    getConnector() {
        if (!connector) {
            connector = initializeConnector<CoinbaseWallet>(
                (actions) =>
                    new CoinbaseWallet(actions, {
                        // 137 for polygon
                        url: getChainUrls()[137][0],
                        appName: 'Streamr Chat',
                    })
            )
        }

        return connector
    },
}

export default walletAdapter
