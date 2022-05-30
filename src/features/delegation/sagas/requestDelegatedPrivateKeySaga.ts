import { Provider } from '@web3-react/types'
import { Wallet } from 'ethers'
import { call, put } from 'redux-saga/effects'
import { Address } from '../../../../types/common'
import MissingDelegationError from '../../../errors/MissingDelegationError'
import getWalletAccountSaga from '../../wallet/sagas/getWalletAccountSaga'
import retrieveDelegatedPrivateKey from '../../../utils/retrieveDelegatedPrivateKey'
import storeDelegatedPrivateKey from '../../../utils/storeDelegatedPrivateKey'
import { setDelegatedPrivateKey } from '../actions'
import getWalletProviderSaga from '../../wallet/sagas/getWalletProviderSaga'
import networkPreflight from '../../../utils/networkPreflight'

interface Params {
    provider?: Provider
    address?: Address
}

export default function* requestDelegatedPrivateKeySaga({
    provider: providerParam = undefined,
    address: addressParam = undefined,
}: Params = {}) {
    const provider: Provider = providerParam ? providerParam : yield call(getWalletProviderSaga)

    const address: Address = addressParam ? addressParam : yield call(getWalletAccountSaga)

    let privateKey: string

    yield networkPreflight(provider)

    try {
        privateKey = yield retrieveDelegatedPrivateKey({
            provider,
            address,
        })

        yield put(setDelegatedPrivateKey(privateKey))
    } catch (e: any) {
        if (!(e instanceof MissingDelegationError)) {
            throw e
        }

        privateKey = Wallet.createRandom().privateKey

        yield storeDelegatedPrivateKey({
            provider,
            address,
            privateKey,
        })
    }

    yield put(setDelegatedPrivateKey(privateKey))
}
