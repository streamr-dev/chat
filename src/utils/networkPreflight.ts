import { Provider } from '@web3-react/types'
import addNetwork from '../utils/addNetwork'
import switchNetwork from '../utils/switchNetwork'
import isCorrectNetwork from './isCorrectNetwork'

export default async function networkPreflight(provider: Provider) {
    try {
        if (await isCorrectNetwork(provider)) {
            return
        }

        await switchNetwork(provider)
    } catch (e: any) {
        if (e.code !== 4902) {
            throw e
        }

        await addNetwork(provider)
    }
}
