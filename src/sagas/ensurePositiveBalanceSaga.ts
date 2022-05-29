import { Provider } from '@web3-react/types'
import { BigNumber, providers } from 'ethers'
import { select } from 'redux-saga/effects'
import { OptionalAddress } from '../../types/common'
import InsufficientFundsError from '../errors/InsufficientFundsError'
import MissingWalletAccountError from '../errors/MissingWalletAccountError'
import MissingWalletProviderError from '../errors/MissingWalletProviderError'
import { selectWalletAccount, selectWalletProvider } from '../features/wallet/selectors'

export default function* ensurePositiveBalanceSaga() {
    const account: OptionalAddress = yield select(selectWalletAccount)

    if (!account) {
        throw new MissingWalletAccountError()
    }

    const provider: undefined | Provider = yield select(selectWalletProvider)

    if (!provider) {
        throw new MissingWalletProviderError()
    }

    const balance: BigNumber = yield new providers.Web3Provider(provider).getBalance(account)

    if (balance.eq(0)) {
        throw new InsufficientFundsError()
    }
}
