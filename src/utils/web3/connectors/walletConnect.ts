import { initializeConnector } from '@web3-react/core'
import { WalletConnect } from '@web3-react/walletconnect'
import getChainUrls from '../../getChainUrls'

const rpc = getChainUrls()

export const [walletConnect, hooks] = initializeConnector<WalletConnect>(
    (actions) => {
        return new WalletConnect(actions, {
            rpc,
        })
    },
    Object.keys(rpc).map((chainId) => Number(chainId))
)
