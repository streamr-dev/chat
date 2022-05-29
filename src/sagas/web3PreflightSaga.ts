import { Provider } from '@web3-react/types'
import { call } from 'redux-saga/effects'
import IncorrectNetworkError from '../errors/IncorrectNetworkError'
import MissingNetworkError from '../errors/MissingNetworkError'
import addNetworkSaga from './addNetworkSaga'
import ensureCorrectNetworkSaga from './ensureCorrectNetworkSaga'
import ensurePositiveBalanceSaga from './ensurePositiveBalanceSaga'
import getWalletProviderSaga from './getWalletProviderSaga'
import switchNetworkSaga from './switchNetworkSaga'

interface Params {
    provider?: Provider
    freeRide?: boolean
}

export default function* web3PreflightSaga({
    provider: providerParam = undefined,
    freeRide = false,
}: Params = {}) {
    const provider: Provider = providerParam ? providerParam : yield call(getWalletProviderSaga)

    try {
        try {
            yield call(ensureCorrectNetworkSaga, provider)
        } catch (e) {
            if (!(e instanceof IncorrectNetworkError)) {
                throw e
            }

            try {
                yield call(switchNetworkSaga, provider)
            } catch (e: any) {
                if (e.code === 4902) {
                    throw new MissingNetworkError()
                }

                throw e
            }
        }
    } catch (e) {
        if (!(e instanceof MissingNetworkError)) {
            throw e
        }

        yield call(addNetworkSaga, provider)
    }

    if (!freeRide) {
        yield call(ensurePositiveBalanceSaga)
    }
}
