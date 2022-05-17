import { initializeConnector } from '@web3-react/core'
import { WalletConnect } from '@web3-react/walletconnect'
import { AdapterId, WalletAdapter } from '../../../../types/common'
import getChainUrls from '../../getChainUrls'
import Icon from '../icons/WalletConnectIcon'

let connector: any

const walletAdapter: WalletAdapter = {
    id: AdapterId.WalletConnect,
    label: 'WalletConnect',
    icon: Icon,
    getConnector() {
        if (!connector) {
            const rpc = getChainUrls()

            connector = initializeConnector<WalletConnect>(
                (actions) =>
                    new WalletConnect(actions, {
                        rpc,
                    }),
                Object.keys(rpc).map(Number)
            )
        }

        return connector
    },
}

export default walletAdapter
