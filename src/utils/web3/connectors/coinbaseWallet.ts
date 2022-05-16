import { CoinbaseWallet } from '@web3-react/coinbase-wallet'
import { initializeConnector } from '@web3-react/core'
import getChainUrls from '../../getChainUrls'

const urls = getChainUrls()

export const [coinbaseWallet, hooks] = initializeConnector<CoinbaseWallet>(
    (actions) =>
        new CoinbaseWallet(actions, {
            // 137 = polygon
            url: urls[137][0],
        })
)
