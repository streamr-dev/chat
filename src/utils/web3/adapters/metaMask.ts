import { initializeConnector } from '@web3-react/core'
import { MetaMask } from '@web3-react/metamask'
import { AdapterId, WalletAdapter } from '../../../../types/common'
import Icon from '../icons/MetaMaskIcon'

let connector: any

const walletAdapter: WalletAdapter = {
    id: AdapterId.MetaMask,
    label: 'MetaMask',
    icon: Icon,
    getConnector() {
        if (!connector) {
            connector = initializeConnector<MetaMask>(
                (actions) => new MetaMask(actions)
            )
        }

        return connector
    },
}

export default walletAdapter
